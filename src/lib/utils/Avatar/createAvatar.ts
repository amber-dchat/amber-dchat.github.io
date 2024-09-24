import { $ } from '@/utils/syntax';
import Resizer from 'react-image-file-resizer';

const VALID_IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export async function promptForAvatar() {
	$<HTMLInputElement>("#avatar")?.click();
}

export function createAvatar(image: File) {
	return new Promise<string>((resolve, reject) => {
		if (!VALID_IMAGE_MIME_TYPES.includes(image.type))
			reject('ERR_INVALID_FORMAT: This is not a valid file format');

		try {
			Resizer.imageFileResizer(
				image,
				312,
				312,
				'JPEG',
				70,
				0,
				(val) => resolve(val as string),
				'base64',
				100,
				100,
			);
		} catch (error) {
			reject(error);
		}
	});
}
