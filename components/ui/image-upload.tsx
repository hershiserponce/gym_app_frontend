"use client"

import { useRef, useState } from "react"
import { Upload, Camera, Trash2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CameraModal } from "@/components/ui/camera-modal"
import { compressImage, validateImageFile } from "@/src/lib/image-compress"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  currentImageUrl?: string | null
  onFileSelect: (file: File | null) => void
  onRemove?: () => void
  className?: string
}

export function ImageUpload({
  currentImageUrl,
  onFileSelect,
  onRemove,
  className,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setError(null)

    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || "Archivo no válido")
      return
    }

    try {
      const compressed = await compressImage(file)
      const previewUrl = URL.createObjectURL(compressed)
      setPreview(previewUrl)
      onFileSelect(compressed)
    } catch {
      setError("Error al procesar la imagen")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleCameraCapture = (file: File) => {
    handleFile(file)
  }

  const handleRemove = () => {
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onFileSelect(null)
    onRemove?.()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const displayUrl = preview || currentImageUrl

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {displayUrl ? (
        <div className="relative">
          <img
            src={displayUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
            </Button>
            {onRemove && (
              <Button
                type="button"
                variant="destructive"
                size="icon-sm"
                onClick={handleRemove}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Arrastra una imagen o selecciona una opción
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Subir archivo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCameraOpen(true)}
            >
              <Camera className="h-4 w-4 mr-2" />
              Tomar foto
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <CameraModal
        open={cameraOpen}
        onOpenChange={setCameraOpen}
        onCapture={handleCameraCapture}
      />
    </div>
  )
}
