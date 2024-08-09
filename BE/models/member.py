from pydantic import BaseModel, Field
import uuid  # Library untuk membuat ID unik

class Member(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    position: str
    reports_to: str = None
    file_url: str = None  # New field to store the image URL

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            uuid.UUID: str
        }
