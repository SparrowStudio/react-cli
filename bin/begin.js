#!/usr/bin/env node
/**
 * @Description:
 * @Author: bubao
 * @Date: 2020-10-22 20:35:58
 * @LastEditors: bubao
 * @LastEditTime: 2020-10-22 21:23:16
 */

// 当系统运行到这一行的时候，去 env 中查找 node 配置，并且调用对应的解释器来运行之后的 node 程序
const { program } = require("commander");
const path = require("path");
const Handlebars = require("handlebars");
const download = require("download-git-repo");
const inquirer = require("inquirer");
const fs = require("fs");
const ora = require("ora");
const chalk = require("chalk");
const { runInstall } = require("../utils/npmInstall");
const { queryArr } = require("../utils/inquireArr");
const { projectSuccess, noPackageJSON, pullFailed, queryError, info } = require("../utils/outputFunc");

const { version } = require("../package.json");

program
	.command("info")
	.description("描述包")
	.action(() => {
		info();
	});
program
	.version(version)
	.command("init <name>")
	.description("初始化模板")
	.action(name => {
		const targetPath = path.resolve(process.cwd(), name);
		if (fs.existsSync(targetPath)) {
			console.log(chalk.red("当前文件名已存在！请重新输入！"));
			return;
		}
		inquirer.prompt(queryArr).then(paramater => {
			console.log("paramater", paramater);
			const spinner = ora("模板下载中^.^请稍后");
			paramater = { ...paramater, version };
			download("direct:https://github.com/walkedSnail/react-template.git", targetPath, { clone: true }, err => {
				if (!err) {
					spinner.succeed();
					const packagePath = path.join(targetPath, "package.json");
					if (fs.existsSync(packagePath)) {
						const content = fs.readFileSync(packagePath).toString();
						const template = Handlebars.compile(content);
						const result = template(paramater);
						fs.writeFileSync(packagePath, result);
					} else {
						spinner.fail();
						noPackageJSON();
						return;
					}
					console.log(chalk.green("success! 项目初始化成功") + "\n");
					runInstall(targetPath, () => projectSuccess(name));
				} else {
					pullFailed(err);
				}
			});
		}).catch(error => {
			queryError(error);
		});
		console.log("hello world");
	});

program.parse(process.argv); // 解析变量

// download('direct:https://github.com/SparrowStudio/font-tempalate-react.git', targetPath, { clone: true }, (err) => {
// console.log(err);
// })

// // 输入源模板
// const source = '<p>description is {{ description }} , author is {{ author }}</p>'

// // 进行模板的解析
// const template = Handlebars.compile(source)
// // 内容的定义
// const paramater = { description: 'xxx', author: 'yyy' }
// // 进行内容的替换
// console.log(template(paramater))
