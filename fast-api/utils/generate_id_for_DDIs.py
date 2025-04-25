import hashlib

def generate_id(hoatchat_1, hoatchat_2):
    # Sắp xếp để tránh đảo ngược
    sorted_hoatchat = sorted([hoatchat_1, hoatchat_2])
    id_str = "_".join(sorted_hoatchat)  # Ghép thành chuỗi
    return hashlib.md5(id_str.encode()).hexdigest()  # Băm thành MD5
