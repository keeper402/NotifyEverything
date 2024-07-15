const nodemailer = require("nodemailer");
// 发送邮件函数
async function sendMail(mailConfig, subject, text) {
    const user = mailConfig.from;//自己的邮箱
    const pass = mailConfig.pass; //qq邮箱授权码,如何获取授权码下面有讲
    const to = mailConfig.to;//对方的邮箱
    let transporter = nodemailer.createTransport({
        host: "smtp.qq.com",
        port: 465,
        auth: {
            user: user, // 用户账号
            pass: pass, //授权码,通过QQ获取
        },
    });
    let info = await transporter.sendMail({
        from: `NotifyEverything<${user}>`, // sender address
        to: `yourmail<${to}>`, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
    });
    console.log("发送成功,info:" + JSON.stringify(info));
}

module.exports = {sendMail};