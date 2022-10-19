#!/bin/sh
sudo date >> ./record.md
set -e
# 获取当前shell所在的路径
# pwd是获取当前命令行的路径
SHELL_FOLDER=$(cd "$(dirname "$0")";pwd)

echo "正在改变文件夹路径到：$SHELL_FOLDER \n"
cd $SHELL_FOLDER

# read -p  "请填写commit提交的信息:" msg
# 空值判断
# if [ ! $msg ]; then  
#  echo "终止提交，因为提交说明为空。"
# else
  echo "\n\n开始执行add-commit操作......"
  # commit可以换成cz工具
  # git add -A && git commit -m "$msg"
  git add -A && git commit -m "record.md"
  echo "commit完毕，开始拉取以及推送代码\n"
  # git pull && git push
  git push
  # 判断上一条命令是否成功
  if [ $? -eq 0 ]; then
    echo "\n\n流程结束，完成提交。"
   else
    echo "\n\n出错了,请解决错误"
   fi
# fi   
