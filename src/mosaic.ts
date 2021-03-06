import { Constants } from './constants';

export const handleMosaic = async (
  mediaList: APIPhoto[],
  id: string
): Promise<APIMosaicPhoto | null> => {
  const mosaicDomains = Constants.MOSAIC_DOMAIN_LIST;
  let selectedDomain: string | null = null;
  while (selectedDomain === null && mosaicDomains.length > 0) {
    // fetch /ping on a random domain
    const domain = mosaicDomains[Math.floor(Math.random() * mosaicDomains.length)];
    // let response = await fetch(`https://${domain}/ping`);
    // if (response.status === 200) {
    selectedDomain = domain;
    // } else {
    //   mosaicDomains = mosaicDomains.filter(d => d !== domain);
    //   console.log(`${domain} is not available, removing from list`);
    // }
  }

  // Fallback if all Mosaic servers are down
  if (selectedDomain === null) {
    return null;
  } else {
    // console.log('mediaList', mediaList);
    const mosaicMedia = mediaList.map(
      media => media.url?.match(/(?<=\/media\/)[\w-]+(?=[.?])/g)?.[0] || ''
    );
    // console.log('mosaicMedia', mosaicMedia);
    // TODO: use a better system for this, 0 gets png 1 gets webp, usually
    const baseUrl = `https://${selectedDomain}/`;
    let path = '';

    if (mosaicMedia[0]) {
      path += `/${mosaicMedia[0]}`;
    }
    if (mosaicMedia[1]) {
      path += `/${mosaicMedia[1]}`;
    }
    if (mosaicMedia[2]) {
      path += `/${mosaicMedia[2]}`;
    }
    if (mosaicMedia[3]) {
      path += `/${mosaicMedia[3]}`;
    }

    return {
      height: mediaList.reduce((acc, media) => acc + media.height, 0),
      width: mediaList.reduce((acc, media) => acc + media.width, 0),
      formats: {
        jpeg: `${baseUrl}jpeg/${id}${path}`,
        webp: `${baseUrl}webp/${id}${path}`
      }
    } as APIMosaicPhoto;
  }
};
