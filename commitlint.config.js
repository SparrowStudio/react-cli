/**
 * @description:
 * @author: bubao
 * @date: 2020-10-03 10:57:02
 * @last author: bubao
 * @last edit time: 2020-10-04 08:53:48
 */
"use strict";
module.exports = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"subject-empty": [0, "always"],
		"type-empty": [0, "always"]
	}
};
