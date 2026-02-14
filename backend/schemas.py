"""
Pydantic Schemas for Request/Response validation
"""
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# File Schemas
class FileBase(BaseModel):
    original_filename: str
    file_size: Optional[int] = None
    file_type: Optional[str] = None

class FileCreate(FileBase):
    stored_filename: str
    file_path: str

class FileResponse(FileBase):
    id: int
    stored_filename: str
    uploaded_at: datetime
    
    class Config:
        from_attributes = True

# Operation Schemas
class OperationBase(BaseModel):
    operation_type: str
    input_files: Optional[str] = None
    parameters: Optional[str] = None

class OperationCreate(OperationBase):
    file_id: Optional[int] = None

class OperationResponse(OperationBase):
    id: int
    status: str
    output_file: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True