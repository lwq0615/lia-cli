#!/usr/bin/env node

// 命令行工具
import { program } from 'commander'
// 显示 loading 动画
import ora from 'ora'
// 用来下载远程模板
import download from 'download-git-repo'
// 用来下载远程模板
import symbols from 'log-symbols'
// 显示 loading 动画
import chalk from 'chalk'
import pkg from '../package.json' assert { type: 'json' }
import fs from 'fs'

(function () {

  chalk.level = 1
  program.version(pkg.version)
  program.usage('<project-name>')
  program.parse(process.argv)
  // 当没有输入参数的时候给个提示
  if (program.args.length < 1) return program.help()

  // 第一个参数是 project-name
  let projectName = program.args[0]
  if (!projectName) {
    console.log(chalk.red('\n Project-name should not be empty! \n '))
    return
  }

  if (fs.existsSync(`./${projectName}-app`)) {
    console.log(chalk.red(symbols.error), chalk.red(`Folder ${projectName}-app already exists`))
    return
  }
  if (fs.existsSync(`./${projectName}-server`)) {
    console.log(chalk.red(symbols.error), chalk.red(`Folder ${projectName}-server already exists`))
    return
  }

  const appUrl = 'https://github.com/lwq0615/lia-app.git'
  console.log("download from '" + appUrl + "'")

  console.log(chalk.green('\n Start generating... \n'))
  // 出现加载图标
  const spinner = ora('Downloading...')
  spinner.start()

  // 下载项目模板代码
  download("direct:" + appUrl, `./${projectName}-app`, { clone: true }, (err) => {
    if (err) {
      spinner.fail()
      console.log(chalk.red(symbols.error), chalk.red(`Generation failed. ${err}`))
      return
    }
    // 读取package.json文件
    fs.readFile(`./${projectName}-app/package.json`, 'utf-8', (err, data) => {
      if (err) console.log(chalk.red(symbols.error), chalk.red(err))
      // 更换项目name
      const pkg = JSON.parse(data)
      pkg.name = projectName
      fs.writeFileSync(`./${projectName}-app/package.json`, JSON.stringify(pkg, null, 2), {
        encoding: 'utf-8'
      }, (err) => {
        spinner.fail()
        console.log(chalk.red(symbols.error), chalk.red(`package.json rename failed. ${err}`))
        return
      })
    })
    // 结束加载图标
    spinner.succeed()
    console.log(chalk.green(symbols.success), chalk.green('Generation completed!'))
    console.log('\n app init done')

    const serverUrl = 'https://github.com/lwq0615/lia-server.git'
    console.log("download from '" + serverUrl + "'")

    console.log(chalk.green('\n Start generating... \n'))
    // 出现加载图标
    spinner.start()

    // 下载项目模板代码
    download("direct:" + serverUrl, `./${projectName}-server`, { clone: true }, (err) => {
      if (err) {
        spinner.fail()
        console.log(chalk.red(symbols.error), chalk.red(`Generation failed. ${err}`))
        return
      }
      // 结束加载图标
      spinner.succeed()
      console.log(chalk.green(symbols.success), chalk.green('Generation completed!'))
      console.log('\n To get started')
    })
  })



})()