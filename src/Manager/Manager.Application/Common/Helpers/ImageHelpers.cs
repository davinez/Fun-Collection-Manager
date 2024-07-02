using System;
using System.IO;
using SkiaSharp;

namespace Manager.Application.Common.Helpers;

public static class ImageHelpers
{
    public static (Stream FileContent, int Height, int Width) Resize(byte[] fileContents,
    int maxWidth, int maxHeight,
    SKFilterQuality quality = SKFilterQuality.High)
    {
        using MemoryStream ms = new MemoryStream(fileContents);
        using SKBitmap sourceBitmap = SKBitmap.Decode(ms);

        int height = Math.Min(maxHeight, sourceBitmap.Height);
        int width = Math.Min(maxWidth, sourceBitmap.Width);

        using SKBitmap scaledBitmap = sourceBitmap.Resize(new SKImageInfo(width, height), quality);

        using SKImage scaledImage = SKImage.FromBitmap(scaledBitmap);

        // Return PNG
        // Compress the image with the specified quality level (e.g., 70)
        using SKData data = scaledImage.Encode(SKEncodedImageFormat.Webp, 100);

        return (data.AsStream(), height, width);
    }
}
