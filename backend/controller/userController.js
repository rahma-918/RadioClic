exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send({ message: "Utilisateur non trouvé", success: false });
        }
        res.status(200).send({ message: "Informations utilisateur récupérées avec succès", success: true, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erreur lors de la récupération des informations utilisateur", success: false, error });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.userId);
        res.status(200).send({ message: "Compte utilisateur supprimé avec succès", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erreur lors de la suppression du compte utilisateur", success: false, error });
    }
};