import { ProfileInformation } from "./InformationProfile";
import { AudioProfile } from "./AudioProfile"; // bạn đã tách trước đó

<ProfileInformation
  username={formData.username}
  effectUsername={formData.effectUsername}
  description={formData.description}
  location={formData.location}
  customCursor={formData.customCursor}
  onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
/>

<AudioProfile
  audio={formData.audio}
  audioTitle={formData.audioTitle}
  audioImage={formData.audioImage}
  uploading={{ audio: uploadingFiles.audio, audioImage: uploadingFiles.audioImage }}
  onFileChange={async (file, field) => handleFileChangeMock(file, field)}
  onTitleChange={(title) => setFormData(prev => ({ ...prev, audioTitle: title }))}
/>
