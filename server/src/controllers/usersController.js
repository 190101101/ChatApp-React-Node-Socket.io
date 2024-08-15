const bcrypt = require('bcryptjs');
const User = require('../model/userModel');

module.exports.register = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.json({ msg: 'username already used', status: false });
    }

    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({ msg: 'email already used', status: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    delete user.password;
    res.json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    let { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ msg: 'username not found', status: false });
    }

    const data = await bcrypt.compare(password, user.password);

    if (!data) {
      return res.json({ msg: 'wrong password', status: false });
    }

    res.json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      'email',
      'username',
      'avatarImage',
      '_id',
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};
