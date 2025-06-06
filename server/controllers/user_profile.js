
import User from '../models/User.js';

// 获取用户信息
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: '用户获取失败' });
  }
};

// 更新用户名
export const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { username, password, avatar } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: '用户不存在' });

    if (username) user.username = username;
    if (avatar) user.avatar = avatar;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    console.log("更新后的用户：", user); // 这里确认有 avatar
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 注销账号
export const deleteUserProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: '账号已注销' });
  } catch (err) {
    res.status(500).json({ message: '账号删除失败' });
  }
};
