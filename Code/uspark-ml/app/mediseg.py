import os
import torch
import numpy as np
import nibabel as nib
import pydicom
import cv2
from PIL import Image
import matplotlib.pyplot as plt
import torch.nn as nn
import torch.nn.functional as F
import torchvision.models as models
from torchvision import transforms
from monai.transforms import EnsureChannelFirst, ScaleIntensity, Resize, ToTensor
from io import BytesIO
import base64

# Set device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# -------------------------------
# CLASSIFIER MODULE (Medical Classifier)
# -------------------------------
class_names = ['AbdomenCT', 'BreastMRI', 'Chest Xray', 'ChestCT',
               'Endoscopy', 'Hand Xray', 'HeadCT', 'HeadMRI']

# Update model path to load from models folder
model_path_classifier = os.path.join("models", "best_metric_model (4).pth")

from monai.networks.nets import DenseNet121
classifier_model = DenseNet121(
    spatial_dims=2,
    in_channels=3,
    out_channels=len(class_names)
).to(device)

state_dict = torch.load(model_path_classifier, map_location=device)
classifier_model.load_state_dict(state_dict, strict=False)
classifier_model.eval()

# A simple transform for classification from a PIL image
def classify_medical_image_pil(image: Image.Image) -> str:
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Resize((224, 224))
    ])
    image_tensor = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        output = classifier_model(image_tensor)
        pred_class = torch.argmax(output, dim=1).item()
    return class_names[pred_class]

# -------------------------------
# SPECIALIZED MODULES
# -------------------------------

# --- A. Brain Tumor Segmentation Module (for HeadCT/HeadMRI) ---
class DoubleConvUNet(nn.Module):
    def __init__(self, in_channels, out_channels):
        super(DoubleConvUNet, self).__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True)
        )
    def forward(self, x):
        return self.conv(x)

class UNetMulti(nn.Module):
    def __init__(self, in_channels=3, out_channels=4):
        super(UNetMulti, self).__init__()
        self.down1 = DoubleConvUNet(in_channels, 64)
        self.pool1 = nn.MaxPool2d(2)
        self.down2 = DoubleConvUNet(64, 128)
        self.pool2 = nn.MaxPool2d(2)
        self.down3 = DoubleConvUNet(128, 256)
        self.pool3 = nn.MaxPool2d(2)
        self.down4 = DoubleConvUNet(256, 512)
        self.pool4 = nn.MaxPool2d(2)
        self.bottleneck = DoubleConvUNet(512, 1024)
        self.up4 = nn.ConvTranspose2d(1024, 512, kernel_size=2, stride=2)
        self.conv4 = DoubleConvUNet(1024, 512)
        self.up3 = nn.ConvTranspose2d(512, 256, kernel_size=2, stride=2)
        self.conv3 = DoubleConvUNet(512, 256)
        self.up2 = nn.ConvTranspose2d(256, 128, kernel_size=2, stride=2)
        self.conv2 = DoubleConvUNet(256, 128)
        self.up1 = nn.ConvTranspose2d(128, 64, kernel_size=2, stride=2)
        self.conv1 = DoubleConvUNet(128, 64)
        self.final_conv = nn.Conv2d(64, out_channels, kernel_size=1)
    
    def forward(self, x):
        c1 = self.down1(x)
        p1 = self.pool1(c1)
        c2 = self.down2(p1)
        p2 = self.pool2(c2)
        c3 = self.down3(p2)
        p3 = self.pool3(c3)
        c4 = self.down4(p3)
        p4 = self.pool4(c4)
        bn = self.bottleneck(p4)
        u4 = self.up4(bn)
        merge4 = torch.cat([u4, c4], dim=1)
        c5 = self.conv4(merge4)
        u3 = self.up3(c5)
        merge3 = torch.cat([u3, c3], dim=1)
        c6 = self.conv3(merge3)
        u2 = self.up2(c6)
        merge2 = torch.cat([u2, c2], dim=1)
        c7 = self.conv2(merge2)
        u1 = self.up1(c7)
        merge1 = torch.cat([u1, c1], dim=1)
        c8 = self.conv1(merge1)
        output = self.final_conv(c8)
        return output

def process_brain_tumor(image: Image.Image, model_path=os.path.join("models", "brain_tumor_unet_multiclass.pth")) -> str:
    model = UNetMulti(in_channels=3, out_channels=4).to(device)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    
    transform_img = transforms.Compose([
        transforms.Resize((256,256)),
        transforms.ToTensor()
    ])
    input_tensor = transform_img(image).unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(input_tensor)
        preds = torch.argmax(output, dim=1).squeeze().cpu().numpy()
    
    image_np = np.array(image.resize((256,256)))
    # Create overlay and blended image
    overlay = cv2.applyColorMap(np.uint8(255 * preds/np.max(preds + 1e-8)), cv2.COLORMAP_JET)
    overlay = cv2.cvtColor(overlay, cv2.COLOR_BGR2RGB)
    blended = cv2.addWeighted(np.uint8(image_np), 0.6, overlay, 0.4, 0)
    
    # Create a figure with subplots
    fig, ax = plt.subplots(1, 3, figsize=(18,6))
    ax[0].imshow(image_np)
    ax[0].set_title("Original Image")
    ax[0].axis("off")
    ax[1].imshow(preds, cmap='jet')
    ax[1].set_title("Segmentation Mask")
    ax[1].axis("off")
    ax[2].imshow(blended)
    ax[2].set_title("Overlay")
    ax[2].axis("off")
    
    buf = BytesIO()
    fig.savefig(buf, format="png")
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode("utf-8")
    plt.close(fig)
    return img_base64

# --- B. Endoscopy Polyp Detection Module (Binary UNet) ---
class UNetBinary(nn.Module):
    def __init__(self, in_channels=3, out_channels=1):
        super(UNetBinary, self).__init__()
        self.down1 = DoubleConvUNet(in_channels, 64)
        self.pool1 = nn.MaxPool2d(2)
        self.down2 = DoubleConvUNet(64, 128)
        self.pool2 = nn.MaxPool2d(2)
        self.down3 = DoubleConvUNet(128, 256)
        self.pool3 = nn.MaxPool2d(2)
        self.down4 = DoubleConvUNet(128, 512)
        self.pool4 = nn.MaxPool2d(2)
        self.bottleneck = DoubleConvUNet(512, 1024)
        self.up4 = nn.ConvTranspose2d(1024, 512, kernel_size=2, stride=2)
        self.conv4 = DoubleConvUNet(1024, 512)
        self.up3 = nn.ConvTranspose2d(512, 256, kernel_size=2, stride=2)
        self.conv3 = DoubleConvUNet(512, 256)
        self.up2 = nn.ConvTranspose2d(256, 128, kernel_size=2, stride=2)
        self.conv2 = DoubleConvUNet(256, 128)
        self.up1 = nn.ConvTranspose2d(128, 64, kernel_size=2, stride=2)
        self.conv1 = DoubleConvUNet(128, 64)
        self.final_conv = nn.Conv2d(64, out_channels, kernel_size=1)
    
    def forward(self, x):
        c1 = self.down1(x)
        p1 = self.pool1(c1)
        c2 = self.down2(p1)
        p2 = self.pool2(c2)
        c3 = self.down3(p2)
        p3 = self.pool3(c3)
        c4 = self.down4(p3)
        p4 = self.pool4(c4)
        bn = self.bottleneck(p4)
        u4 = self.up4(bn)
        merge4 = torch.cat([u4, c4], dim=1)
        c5 = self.conv4(merge4)
        u3 = self.up3(c5)
        merge3 = torch.cat([u3, c3], dim=1)
        c6 = self.conv3(merge3)
        u2 = self.up2(c6)
        merge2 = torch.cat([u2, c2], dim=1)
        c7 = self.conv2(merge2)
        u1 = self.up1(c7)
        merge1 = torch.cat([u1, c1], dim=1)
        c8 = self.conv1(merge1)
        output = self.final_conv(c8)
        return output

def process_endoscopy(image: Image.Image, model_path=os.path.join("models", "endoscopy_unet.pth")) -> str:
    model = UNetBinary(in_channels=3, out_channels=1).to(device)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    
    transform_img = transforms.Compose([
        transforms.Resize((256,256)),
        transforms.ToTensor()
    ])
    input_tensor = transform_img(image).unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(input_tensor)
        prob = torch.sigmoid(output)
        mask = (prob > 0.5).float().squeeze().cpu().numpy()
    
    image_np = np.array(image.resize((256,256)))
    overlay = cv2.applyColorMap(np.uint8(255*mask), cv2.COLORMAP_JET)
    overlay = cv2.cvtColor(overlay, cv2.COLOR_BGR2RGB)
    blended = cv2.addWeighted(np.uint8(image_np), 0.6, overlay, 0.4, 0)
    
    fig, ax = plt.subplots(1, 3, figsize=(18,6))
    ax[0].imshow(image_np)
    ax[0].set_title("Actual Image")
    ax[0].axis("off")
    ax[1].imshow(mask, cmap='gray')
    ax[1].set_title("Segmentation Mask")
    ax[1].axis("off")
    ax[2].imshow(blended)
    ax[2].set_title("Overlay")
    ax[2].axis("off")
    
    buf = BytesIO()
    fig.savefig(buf, format="png")
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode("utf-8")
    plt.close(fig)
    return img_base64

# --- C. Pneumonia Detection Module (Using Grad-CAM on ResNet18) ---
class GradCAM_Pneumonia:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        self.hook_handles = []
        self._register_hooks()
    
    def _register_hooks(self):
        def forward_hook(module, input, output):
            self.activations = output.detach()
        def backward_hook(module, grad_in, grad_out):
            self.gradients = grad_out[0].detach()
        handle1 = self.target_layer.register_forward_hook(forward_hook)
        handle2 = self.target_layer.register_backward_hook(backward_hook)
        self.hook_handles.extend([handle1, handle2])
    
    def remove_hooks(self):
        for handle in self.hook_handles:
            handle.remove()
    
    def generate(self, input_image, target_class=None):
        output = self.model(input_image)
        if target_class is None:
            target_class = output.argmax(dim=1).item()
        self.model.zero_grad()
        one_hot = torch.zeros_like(output)
        one_hot[0, target_class] = 1
        output.backward(gradient=one_hot, retain_graph=True)
        weights = self.gradients.mean(dim=(2,3), keepdim=True)
        cam = (weights * self.activations).sum(dim=1, keepdim=True)
        cam = F.relu(cam)
        cam = cam.squeeze().cpu().numpy()
        _, _, H, W = input_image.shape
        cam = cv2.resize(cam, (W, H))
        cam = (cam - np.min(cam)) / (np.max(cam) - np.min(cam) + 1e-8)
        return cam, output

def process_pneumonia(image: Image.Image, model_path=os.path.join("models", "pneumonia_resnet18.pth")) -> str:
    model = models.resnet18(pretrained=False)
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, 2)  # 2 classes: normal and pneumonia
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.to(device)
    model.eval()
    
    grad_cam = GradCAM_Pneumonia(model, model.layer4)
    
    transform_img = transforms.Compose([
        transforms.Resize((224,224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485,0.456,0.406],
                             std=[0.229,0.224,0.225])
    ])
    input_tensor = transform_img(image).unsqueeze(0).to(device)
    with torch.no_grad():
        cam, output = grad_cam.generate(input_tensor)
        predicted_class = output.argmax(dim=1).item()
    label_text = "Pneumonia" if predicted_class == 1 else "Normal"
    
    def get_bounding_box(heatmap, thresh=0.5, min_area=100):
        heat_uint8 = np.uint8(255 * heatmap)
        ret, binary = cv2.threshold(heat_uint8, int(thresh*255), 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if len(contours)==0:
            return None
        largest = max(contours, key=cv2.contourArea)
        if cv2.contourArea(largest) < min_area:
            return None
        x, y, w, h = cv2.boundingRect(largest)
        return (x, y, w, h)
    
    bbox = None
    if predicted_class == 1:
        bbox = get_bounding_box(cam, thresh=0.5, min_area=100)
    
    resized_image = image.resize((224,224))
    image_np = np.array(resized_image)
    overlay = image_np.copy()
    if bbox is not None:
        x, y, w, h = bbox
        cv2.rectangle(overlay, (x, y), (x+w, y+h), (255,0,0), 2)
    cv2.putText(overlay, label_text, (10,25), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,0),2)
    
    heatmap_color = cv2.applyColorMap(np.uint8(255*cam), cv2.COLORMAP_JET)
    heatmap_color = cv2.cvtColor(heatmap_color, cv2.COLOR_BGR2RGB)
    
    fig, ax = plt.subplots(1, 3, figsize=(18,6))
    ax[0].imshow(image_np)
    ax[0].set_title("Actual Image")
    ax[0].axis("off")
    ax[1].imshow(heatmap_color)
    ax[1].set_title("Detected Output (Heatmap)")
    ax[1].axis("off")
    ax[2].imshow(overlay)
    ax[2].set_title("Boxed Overlay")
    ax[2].axis("off")
    
    buf = BytesIO()
    fig.savefig(buf, format="png")
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode("utf-8")
    plt.close(fig)
    grad_cam.remove_hooks()
    return img_base64

# -------------------------------
# COMPLETE PIPELINE FUNCTION
# -------------------------------
def complete_pipeline_image(image: Image.Image) -> dict:
    predicted_modality = classify_medical_image_pil(image)
    result = {"predicted_modality": predicted_modality}
    
    if predicted_modality in ["HeadCT", "HeadMRI"]:
        result_overlay = process_brain_tumor(image)
        result["segmentation_result"] = result_overlay
    elif predicted_modality == "Endoscopy":
        result_overlay = process_endoscopy(image)
        result["segmentation_result"] = result_overlay
    elif predicted_modality == "Chest Xray":
        result_overlay = process_pneumonia(image)
        result["segmentation_result"] = result_overlay
    else:
        # For modalities without specialized processing, return the original image as base64
        buf = BytesIO()
        image.save(buf, format="PNG")
        result["segmentation_result"] = base64.b64encode(buf.getvalue()).decode("utf-8")
    return result
