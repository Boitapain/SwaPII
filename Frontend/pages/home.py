import streamlit as st
from utils.i18n import Translator

if "lang" not in st.session_state:
    st.session_state["lang"] = "en"
t = Translator(st.session_state["lang"])

st.title(t.t("home.title"))
st.write(t.t("home.welcome"))
st.write(t.t("home.main_app_text"))
