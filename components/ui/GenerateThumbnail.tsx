import { useRef, useState } from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { Label } from './label';
import { Textarea } from './textarea';
import { GenerateThumbnailProps } from '@/types';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { useAction, useMutation } from 'convex/react';
import { useUploadFiles } from '@xixixao/uploadstuff/react';
import { api } from '@/convex/_generated/api';
import { v4 as uuidv4 } from 'uuid';

const GenerateThumbnail = ({
	setImage,
	setImageStorageId,
	image,
	imagePrompt,
	setImagePrompt,
}: GenerateThumbnailProps) => {
	const [isAiThumbnail, setIsAiThumbnail] = useState(false);
	const [isImageLoading, setisImageLoading] = useState(false);
	const imageRef = useRef<HTMLInputElement>(null);
	const generateUploadUrl = useMutation(api.files.generateUploadUrl);
	const { startUpload } = useUploadFiles(generateUploadUrl);
	const getImageUrl = useMutation(api.podcasts.getUrl);

	const handleGenerateThumbnail = useAction(api.openai.GenerateThumbnailAction);

	const handleImage = async (blob: Blob, fileName: string) => {
		setisImageLoading(true);
		setImage('');
		try {
			const file = new File([blob], fileName, { type: 'image/png' });

			const uploaded = await startUpload([file]);
			const storageId = (uploaded[0].response as any).storageId;
			setImageStorageId(storageId);
			const imageUrl = await getImageUrl({ storageId });
			setImage(imageUrl!);
			setisImageLoading(false);
			toast({
				title: 'Thumbnail Generated Successfully',
			});
		} catch (error) {
			console.log(error);
			toast({ title: 'Error Generating Thumbnail', variant: 'destructive' });
		}
	};
	const generateImage = async () => {
		try {
			const response = await handleGenerateThumbnail({ prompt: imagePrompt });
			const blob = new Blob([response], { type: 'Image/png' });
			handleImage(blob, `thumbnail-${uuidv4()}`);
		} catch (error) {
			console.log(error);
			toast({ title: 'Error Generating Thumbnail', variant: 'destructive' });
		}
	};
	const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		try {
			const files = e.target.files;
			if (!files) return;
			const file = files[0];
			const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));
			handleImage(blob, file.name);
		} catch (error) {
			console.log(error);
			toast({ title: 'Error Uplaoding Image', variant: 'destructive' });
		}
	};
	return (
		<>
			<div className='generate_thumbnail transition-all duration-500'>
				<Button
					type='button'
					onClick={() => setIsAiThumbnail(true)}
					variant='plain'
					className={cn('', { 'bg-black-6': isAiThumbnail })}
				>
					Use AI to Generate Thumbnail
				</Button>

				<Button
					type='button'
					variant='plain'
					onClick={() => setIsAiThumbnail(false)}
					className={cn('', { 'bg-black-6': !isAiThumbnail })}
				>
					Upload Custom Image
				</Button>
			</div>

			{isAiThumbnail ? (
				<div className='flex flex-col gap-2.5 mt-5 transition-all duration-500'>
					<div className='flex flex-col gap-2.5'>
						<Label className='text-16 font-bold text-white-1'>
							AI Prompt to Generate Thumbnail
						</Label>
						<Textarea
							className='input-class  focus-visible:ring-orange-1 text-white-1'
							placeholder='Provide text to Generate Thumbnail '
							rows={5}
							value={imagePrompt}
							onChange={(e) => setImagePrompt(e.target.value)}
						/>
					</div>

					<div className='w-full max-w-[200px]'>
						<Button
							type='submit'
							className='text-16  bg-orange-1 py-4 font-bold text-white-1 transition-all duration-500 hover:bg-black-1'
							onClick={generateImage}
						>
							{isImageLoading ? (
								<>
									Generating...
									<Loader size={20} className='animate-spin ml-2' />
								</>
							) : (
								'Generate'
							)}
						</Button>
					</div>
				</div>
			) : (
				<div className='image_div' onClick={() => imageRef?.current?.click()}>
					<input
						type='file'
						className='hidden'
						ref={imageRef}
						onChange={(e) => uploadImage(e)}
					/>
					{!isImageLoading ? (
						<Image src='/icons/upload-image.svg' width={40} height={40} alt='uplaod' />
					) : (
						<div className='flex-center text-16 font-medium text-white-1'>
							Uploading...
							<Loader size={20} className='animate-spin ml-2' />
						</div>
					)}
					<div className='flex flex-col items-center gap-1'>
						<h2 className='text-12 font-bold text-orange-1'>Click to Upload</h2>
						<p className='text-12 font-normal text-gray-1'>
							SVG, PNG, JPEG or GIF (max.100x1080px)
						</p>
					</div>
				</div>
			)}

			{image && (
				<div className='flex-center w-full'>
					<Image src={image} width={200} height={200} className='mt-5' alt='Thumbnail' />
				</div>
			)}
		</>
	);
};

export default GenerateThumbnail;
