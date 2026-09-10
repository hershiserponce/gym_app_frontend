interface CompressOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

const DEFAULT_OPTIONS: CompressOptions = {
  maxWidth: 800,
  maxHeight: 800,
  quality: 0.85,
}

export async function compressImage(
  file: File,
  options?: CompressOptions
): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img

      if (width > opts.maxWidth!) {
        height = (height * opts.maxWidth!) / width
        width = opts.maxWidth!
      }

      if (height > opts.maxHeight!) {
        width = (width * opts.maxHeight!) / height
        height = opts.maxHeight!
      }

      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("No se pudo crear el canvas"))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Error al comprimir la imagen"))
            return
          }

          const compressedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          })

          resolve(compressedFile)
        },
        "image/jpeg",
        opts.quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Error al cargar la imagen"))
    }

    img.src = url
  })
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"]

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Tipo de archivo no permitido. Use: JPG, PNG o WebP",
    }
  }

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
    return {
      valid: false,
      error: `El archivo excede el tamaño máximo de 5 MB (${sizeMB} MB)`,
    }
  }

  return { valid: true }
}
