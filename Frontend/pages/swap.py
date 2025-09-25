import streamlit as st
from utils.i18n import Translator

t = None
if "lang" not in st.session_state:
    st.session_state["lang"] = "en"
t = Translator(st.session_state["lang"])

st.title(t.t("swap.title"))

display_full, display_2, display_1 = st.tabs([":material/view_comfy_alt:", ":material/view_column_2:", ":material/view_array:"])

with display_full:
    with st.container(border=True):
        col1, col2 = st.columns(2, gap="small")
        with col1:
            with st.container():
                input_text = st.text_area("Input", key="input_text", height=200, label_visibility="collapsed", placeholder=f'''{t.t("swap.anonymize_placeholder")}''')
                input_text_2 = st.text_area("Input 2", key="input_text_2", height=200, label_visibility="collapsed", placeholder=f'''{t.t("swap.deanonymize_placeholder")}''')
        with col2:
            with st.container():
                st.code(f'''{st.session_state.get('input_text', '')}''', height=200)
                st.code(f'''{st.session_state.get('input_text_2', '')}''', height=200)