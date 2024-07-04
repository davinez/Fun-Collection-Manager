using System;
using System.IO;
using SkiaSharp;

namespace Manager.Application.Common.Helpers;

public static class ImageHelpers
{
    public static Stream Resize(byte[] fileContents,
    int maxWidth, int maxHeight)
    {
        SKFilterMode filter = SKFilterMode.Linear;
        SKSamplingOptions options = new(filter);

        using SKBitmap sourceBitmap = SKBitmap.Decode(fileContents);

        int height = Math.Min(maxHeight, sourceBitmap.Height);
        int width = Math.Min(maxWidth, sourceBitmap.Width);

        using SKBitmap scaledBitmap = sourceBitmap.Resize(new SKImageInfo(width, height), options);

        using SKImage scaledImage = SKImage.FromBitmap(scaledBitmap);

        using SKData encodedImage = scaledImage.Encode(SKEncodedImageFormat.Webp, 90);

        var stream = new MemoryStream();
        encodedImage.SaveTo(stream);
        stream.Seek(0, SeekOrigin.Begin);
        return stream;
    }
}
