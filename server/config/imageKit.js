import ImageKit from '@imagekit/nodejs';

var imagekit = new ImageKit({
    pulicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    PrivateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});

export default imagekit;