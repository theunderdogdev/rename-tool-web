from os import stat
from os.path import join, expanduser
from stat import S

st = stat(join(expanduser("~"), "Library"))
print(st.st_mode & st.st_uid)
