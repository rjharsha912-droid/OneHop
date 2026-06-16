# models/user.py

from pydantic import BaseModel, EmailStr
from typing import Optional


class SignupModel(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginModel(BaseModel):
    email: EmailStr
    password: str
