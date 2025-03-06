/**
 * @fileoverview Custom browser history object for navigation control.
 * Used for programmatic navigation outside of React components.
 */

import { createBrowserHistory } from "history";

/**
 * Custom history object for managing browser navigation.
 * Useful for navigating programmatically in Redux middleware or utilities.
 *
 * @constant {History}
 */
const history = createBrowserHistory();

export default history;
