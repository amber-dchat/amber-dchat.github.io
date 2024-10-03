import Resizer from 'react-image-file-resizer';

const VALID_IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export function promptForAvatar(): Promise<File> {
	const input = document.querySelector<HTMLInputElement>('#avatar');

	return new Promise((res, err) => {
		if (input) {
			input.addEventListener('change', () => {
				const file = input.files && input.files[0];

				if (file) {
					res(file);
				}
			});

			input.click();
		} else {
			err('');
		}
	});
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
