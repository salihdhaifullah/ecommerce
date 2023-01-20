type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>


export default async function createResizedImage(file: File, width: number = 1200, height: number = 800, quality: Range<30, 101> = 80): Promise<string> {

    const reader = new FileReader();
    let resizedDataUrl = ""

    if (!file || !file.type || !file.type.includes("image")) {
        throw Error("File Is NOT Image! OR THEY ARE NO FILE");
    }

    reader.readAsDataURL(file);

    return await new Promise((resolve, reject) => {
        reader.onload = () => {
            console.log("Whating ")
            const image = new Image();
            image.src = reader.result as string;

            image.onload = () => {
                const qualityDecimal = quality / 100;
                const canvas = document.createElement("canvas");

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");

                if (!ctx) {
                    throw new Error("No Canvas Element Found")
                }

                ctx.fillStyle = "rgba(0, 0, 0, 0)";
                ctx.fillRect(0, 0, width, height);

                if (ctx.imageSmoothingEnabled && ctx.imageSmoothingQuality) {
                    ctx.imageSmoothingQuality = 'high';
                }

                ctx.drawImage(image, 0, 0, width, height);
                console.log("Whating 2")

                resolve(canvas.toDataURL(`image/WEBP`, qualityDecimal))
            };

            reader.onerror = (error: any) => {
                reject(Error(error));
            };

        }
    })
}
