/// todo finish this
const nodemailer = require("nodemailer");
// 发送邮件函数
async function sendMail(mailConfig) {
    const user = "xxx@qq.com";//自己的邮箱
    const pass = "xxx"; //qq邮箱授权码,如何获取授权码下面有讲
    const to = "waitfor_1153@qq.com";//对方的邮箱
    let transporter = nodemailer.createTransport({
        host: "smtp.qq.com",
        port: 587,
        secure: false,
        auth: {
            user: user, // 用户账号
            pass: pass, //授权码,通过QQ获取
        },
    });
    let info = await transporter.sendMail({
        from: `的1<${user}>`, // sender address
        to: `的2<${to}>`, // list of receivers
        subject: "Title test", // Subject line
        text: mailConfig.text, // plain text body
    });
    console.log("发送成功");
}

//测试一下
send('你好')
