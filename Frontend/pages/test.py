import streamlit as st
import hashlib
import random

def get_color_from_email(email):
    """Generate a consistent random color from email"""
    random.seed(int(hashlib.md5(email.encode()).hexdigest(), 16))
    colors = ["#FF5733", "#FF8800", "#FFC300", "#33FF57", "#33FFF3", "#3375FF", "#C700FF"]
    return random.choice(colors)

def avatar_html(email, size=50):
    initials = email[:2].upper()
    bg_color = get_color_from_email(email)
    html = f"""
    <div style="
        width: {size}px;
        height: {size}px;
        background-color: {bg_color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: {size//2}px;
        color: white;
        text-transform: uppercase;
    ">
        {initials}
    </div>
    """
    return html

# Example
email = "test@mail.com"
st.markdown(avatar_html(email, size=50), unsafe_allow_html=True)
