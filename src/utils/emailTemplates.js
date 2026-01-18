// Email template configuration for EmailJS
export const EMAIL_CONFIG = {
    serviceId: 'service_p5srzyq',
    templateId: 'template_yn7mv5v',
    publicKey: 'SUuBonUM5YiD3oRIc'
}

// Email template parameters
export const formatEmailTemplate = (formData) => {
    return {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        timestamp: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }
}
