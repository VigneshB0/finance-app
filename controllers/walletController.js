const Wallet = require("../models/Wallet");

exports.createWallet = async (req, res) => {
  try {
    const wallet = await Wallet.create({
      name: req.body.name,
      UserId: req.user.id,
    });

    res.json(wallet);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getWallets = async (req, res) => {
  try {
    const wallets = await Wallet.findAll({
      where: { UserId: req.user.id },
    });

    res.json(wallets);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({
      where: {
        id: req.params.walletId,
        UserId: req.user.id,
      },
    });

    if (!wallet)
      return res.status(404).json({ msg: "Wallet not found" });

    await wallet.destroy();

    res.json({ msg: "Wallet deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};