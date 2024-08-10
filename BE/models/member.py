from pydantic import BaseModel, Field
import uuid

class Skills(BaseModel):
    leadership: int = 0
    communication: int = 0
    problemSolving: int = 0

class Member(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    position: str
    reports_to: str = None
    file_url: str = None
    skills: Skills = Field(default_factory=Skills)

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            uuid.UUID: str
        }
