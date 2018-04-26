package com.common.utils;


import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

public final class UniqueIdUtils {
    static private int serverId;
    static long lastTime;
    static int count;

    /**
     * 采用类似snowFlake的算法实现分布式唯一Id
     * <p>
     * 通过服务器Id(10 bit) + 时间戳(41 bit) + 自增序列(13 bit)来实现
     * 可以支持 1024台计算机上每台每毫秒产生8192个id
     *
     * @return 唯一id
     */
    public static String randomID() {
        String str = "";
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
            Date date1 = new Date();
            Date date2 = formatter.parse("2010-01-01");
            long i = date1.getTime() - date2.getTime();
            long count = genCount(i);
            if (serverId == 0) {
                //serverId = Integer.valueOf(PropertiesReader.getProperty("serverId"));
            }
            long id = (serverId << 54) + (i << 13) + count;
            str = String.valueOf(id);
        } catch (Exception e) {
            str = UUID.randomUUID().toString();
        }
        return str;
    }

    /**
     * 当一毫秒内需要产生多个id时, 通过自增count来实现, 此方法线程安全
     *
     * @param now
     * @return
     */
    private static synchronized int genCount(long now) {
        if (lastTime == now)
            return ++count;
        else {
            lastTime = now;
            count = 0;
            return 0;
        }
    }

    public static String GetId2() throws Exception {
        return java.util.UUID.randomUUID().toString().replace("-", "").substring(16);
    }

    public static String GetDate() {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Date date1 = new Date();
        return formatter.format(date1);
    }


    /**
     * 取出一个指定长度大小的随机正整数.
     *
     * @param length int 设定所取出随机数的长度。length小于11
     * @return int 返回生成的随机数。
     */
    public static int buildRandom(int length) {
        int num = 1;
        double random = Math.random();
        if (random < 0.1) {
            random = random + 0.1;
        }
        for (int i = 0; i < length; i++) {
            num = num * 10;
        }
        return (int) ((random * num));
    }
}
