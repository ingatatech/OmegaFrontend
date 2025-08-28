const nextConfig = {
	output: "export",
	images: {
		unoptimized: true,
		domains: [
			"res.cloudinary.com",
			// add other domains if needed
		],
	},
	trailingSlash: true,
};
module.exports = nextConfig;
