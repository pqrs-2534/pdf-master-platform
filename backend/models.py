"""
Database Models
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    """User accounts"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Integer, default=1)
    
    # Relationships
    files = relationship("File", back_populates="owner")
    operations = relationship("Operation", back_populates="user")


class File(Base):
    """Store metadata about files"""
    __tablename__ = "files"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    original_filename = Column(String, nullable=False)
    stored_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer)
    file_type = Column(String)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="files")
    operations = relationship("Operation", back_populates="file")


class Operation(Base):
    """Track all PDF operations"""
    __tablename__ = "operations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_id = Column(Integer, ForeignKey("files.id"), nullable=True)
    operation_type = Column(String, nullable=False)
    status = Column(String, default='pending')
    input_files = Column(Text)
    output_file = Column(String)
    parameters = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="operations")
    file = relationship("File", back_populates="operations")


class EditSession(Base):
    """Save PDF editing sessions"""
    __tablename__ = "edit_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_id = Column(Integer, ForeignKey("files.id"), nullable=False)
    session_data = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)