import { AlertCircle } from "lucide-react"

 // Helper component for error display
 export  const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null
    return (
      <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>{error}</span>
      </div>
    )
  }