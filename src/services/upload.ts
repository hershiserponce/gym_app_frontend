import api from "@/src/services/api"
import type { EntityId } from "@/src/utils/strapi"
import { unwrapEntity } from "@/src/utils/strapi"

export const uploadService = {
  async uploadClientPhoto(clientId: EntityId, file: File) {
    const formData = new FormData()
    formData.append("photo", file)

    const response = await api.post(`/clients/${clientId}/photo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })

    return unwrapEntity(response.data)
  },

  async deleteClientPhoto(clientId: EntityId) {
    const response = await api.delete(`/clients/${clientId}/photo`)
    return unwrapEntity(response.data)
  },

  async uploadProductImage(productId: EntityId, file: File) {
    const formData = new FormData()
    formData.append("image", file)

    const response = await api.post(`/products/${productId}/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })

    return unwrapEntity(response.data)
  },

  async deleteProductImage(productId: EntityId) {
    const response = await api.delete(`/products/${productId}/image`)
    return unwrapEntity(response.data)
  },
}
