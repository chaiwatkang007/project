import { v4 } from "uuid";
import {
  Adminlog,
  CreateUser,
  Sendmail,
  UpdateUser,
} from "../interface/users.interface";
import Users from "../model/users.model";
import { IId, IQuerys } from "../interface/common.interface";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const genQuery = (args: IQuerys) => {
  let body: any = {};
  if (args?.query) {
    body = {
      ...body,
      [Op.or]: [{ username: { [Op.like]: `%${args?.query}%` } }],
    };
  }
  return body;
};

const usersController = {
  users: async (args: IQuerys) => {
    return Users.findAndCountAll({
      where: genQuery(args),
      limit: args?.limit,
      offset: args?.skip,
    }).then(({ rows, count }) => {
      return { count, rows: rows };
    });
  },
  create: async (args: CreateUser) => {
    let user = await Users.findOne({ where: { username: args?.username } });
    if (user) throw Error("ผู้ใช้งานนี้มีอยู่ในระบบอยู่แล้ว");

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(args.password, saltRounds);

    let newUser = await Users.create({
      id: v4(),
      ...args,
      password: hashedPassword,
    });
    return newUser;
  },
  update: async (args: UpdateUser) => {
    let user = await Users.findOne({ where: { email: args.email } });
    if (!user) throw Error("ไม่พบผู้ใช้งานนี้มีอยู่ในระบบ");

    //เช็ครหัสผ่านซ้ำไหม
    const oldpassword = await bcrypt.compare(args.password, user.password);
    if (oldpassword) {
      throw Error("รหัสผ่านซ้ำกับอันเดิม กรุณาเปลี่ยนใหม่อีกครั้ง");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(args.password, saltRounds);

    let newUser = await user.update({
      args,
      password: hashedPassword,
    });
    return newUser;
  },
  delete: async (args: IId) => {
    let user = await Users.findByPk(args?.id);
    if (!user) throw Error("ไม่พบผู้ใช้งานนี้มีอยู่ในระบบ");
    await user.destroy();
    return "ลบผู้ใช้งานสำเร็จ";
  },
  sendmail: async (args: Sendmail) => {
    // let user = await Users.findOne({ where: { email: args?.email } });
    // if (!user) throw Error("ไม่พบ Email ผู้ใช้งานนี้อยู่ในระบบ");
    // return "Email นี้อยู่ในระบบ";

    let user = await Users.findOne({ where: { email: args?.email } });
    if (!user) {
      throw new Error("ไม่พบ Email ผู้ใช้งานนี้อยู่ในระบบ");
    }

    if (user) {
      await user.update({
        verify: args.verify,
      });
    }

    // ส่งอีเมล
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "chaiwat.come@bumail.net",
        pass: "Kang07112542",
      },
    });

    const mailOptions = {
      from: "", // อีเมลของผู้ส่ง
      to: user.email, // ใช้อีเมลจากผู้ใช้ที่พบในฐานข้อมูล
      subject: "Verification Code",
      text: `Your verification code is: ${args.verify}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return "ส่งรหัสยืนยันไปยังอีเมลแล้ว";
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("เกิดข้อผิดพลาดในการส่งอีเมล");
    }
  },
  adminlog: async (args: Adminlog) => {
    let user = await Users.findOne({ where: { username: args.username } });
    if (!user) throw Error("ไม่พบผู้ใช้งานนี้มีอยู่ในระบบ");

    const passwordMatch = await bcrypt.compare(args.password, user.password);
    if (passwordMatch) {
      return user
    }
    if (!passwordMatch) {
      throw new Error("รหัสผ่านไม่ถูกต้อง");
    }

    // if(users?.password === password) {
    //   return done(undefined, { users }, null)
    // } else {
    //     return done(undefined, false, {
    //         message: "รหัสผ่านไม่ถูกต้อง"
    //     })
    // }
  },
};

export default usersController;
