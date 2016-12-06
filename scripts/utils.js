function conditionHack(cnd1, msg1, cnd2, msg2) {
    if (cnd1) {
        return msg1;
    } else if (cnd2) {
        return msg2;
    } else {
        return "";
    }
}