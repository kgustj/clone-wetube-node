import Video from "../models/video";

export const home = async (req, res) => {
    const videos = await Video.find({}).sort({ createdAt: "desc" });
    return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
    const { id } = req.params;
    // const id = req.params.id;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found" })
    };
    return res.render("watch", { pageTitle: video.title, video })
}

export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload" });
}

export const postUpload = async (req, res) => {
    const file = req.file;
    const { title, description, hashtags } = req.body;
    try {
        await Video.create({
            title,
            description,
            videoUrl : file.path,
            hashtags: Video.formatHashtags(hashtags),
        });
        return res.redirect("/");
    } catch (error) {
        return res.status(404).render("upload", {
            pageTitle: "Upload",
            errorMessage: error._message,
        });
    }
}

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).ender("404", { pageTitle: "Video not found" })
    };
    return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
}

export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found" })
    };
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect(`/video/${id}`);
};

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
};

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(`${keyword}`, "i")
            },
        })
    }
    return res.render("search", { pageTitle: "Search", videos });
}