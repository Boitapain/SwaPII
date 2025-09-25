import streamlit as st
from utils.i18n import Translator

def load():
    # Set up top navigation for files in 'pages' directory
    if "lang" not in st.session_state:
        st.session_state["lang"] = "fr"
    t = Translator(st.session_state["lang"])

    pg = st.navigation([
        st.Page("pages/home.py", title=t.t("home.title"), icon=":material/home:"),
        st.Page("pages/language.py", title=t.t("language.title"), icon=":material/language:")
    ], position="top", expanded=True)
    pg.run()