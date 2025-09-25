import streamlit as st
import os
from utils.i18n import Translator
import components.navbar as navbar

# Load navbar component
navbar.load()

# Main content
if "lang" not in st.session_state:
    st.session_state["lang"] = "fr"
    
css_path = os.path.join(os.path.dirname(__file__), "styles.css")
with open(css_path) as f:
    st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)