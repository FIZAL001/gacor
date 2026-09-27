// ============================================================
// FF GUEST GENERATOR API - VERCEL FUNCTION
// ============================================================
// Endpoint: /api/gen?region=ID&prefix=FAX
// Multi-fallback URL, TANPA Host header
// ============================================================

import crypto from 'crypto';

const CONNECT_URLS = [
    "https://100067.connect.garena.com",
    "https://connect.garena.com"
];

const LOGIN_BP_URLS = [
    "https://loginbp.ppmainecoonghj.com",
    "https://loginbp.ggpolarbear.com",
    "https://loginbp.ggblueshark.com"
];

const REGISTER_PATH = "/api/v2/oauth/guest:register";
const TOKEN_PATH = "/api/v2/oauth/guest/token:grant";
const MAJOR_REGISTER_PATH = "/MajorRegister";
const MAJOR_LOGIN_PATH = "/MajorLogin";

const HEX_KEY = "2ee44819e9b4598845141067b281621874d0d5d7af9d8f7e00c1e54715b7d1e3";
const API_KEY = Buffer.from(HEX_KEY, 'hex');

const AES_KEY = Buffer.from([89,103,38,116,99,37,68,69,117,104,54,37,90,99,94,56]);
const AES_IV = Buffer.from([54,111,121,90,68,114,50,50,69,51,121,99,104,106,77,37]);

const RELEASE_VERSION = "OB55";
const UNITY_VERSION = "2018.4.12f1";

const REGION_LANG = {
    "BD": "bn", "IND": "hi", "PK": "ur", "SG": "en",
    "ID": "id", "ME": "ar", "CIS": "ru", "TH": "th",
    "VN": "vi", "BR": "pt", "US": "en"
};

function aesEncrypt(dataBytes) {
    const cipher = crypto.createCipheriv('aes-128-cbc', AES_KEY, AES_IV);
    cipher.setAutoPadding(true);
    return Buffer.concat([cipher.update(dataBytes), cipher.final()]);
}

function hmacSign(payload) {
    return crypto.createHmac('sha256', API_KEY).update(payload).digest('hex');
}

function randStr(len, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
    let s = '';
    for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
}

function genPassword() { return `FAX_${randStr(12)}`; }
function genName(prefix = 'FAX') { return `${prefix}${randStr(9)}`; }
function genApiName() { return `FAX${randStr(6)}`; }
function genApiPassword() { return `FAX_${randStr(16)}`; }

const RARE_PATTERNS = {
    HIGH: /(1111111|2222222|3333333|4444444|5555555|6666666|7777777|8888888|9999999|0000000)/,
    LEGEND: /(111111|222222|333333|444444|555555|666666|777777|888888|999999|000000)/,
    MEDIUM: /(11111|22222|33333|44444|55555|66666|77777|88888|99999|00000)/,
    LOW: /(1111|2222|3333|4444|5555|6666|7777|8888|9999|0000)/
};

function detectRarity(accountId) {
    if (!accountId || accountId === 'N/A') return { rarity: 'NORMAL', score: 0, pattern: null };
    const aid = String(accountId);
    if (RARE_PATTERNS.HIGH.test(aid)) return { rarity: 'HIGH', score: 5, pattern: 'HIGH' };
    if (RARE_PATTERNS.LEGEND.test(aid)) return { rarity: 'LEGEND', score: 4, pattern: 'LEGEND' };
    if (RARE_PATTERNS.MEDIUM.test(aid)) return { rarity: 'MEDIUM', score: 3, pattern: 'MEDIUM' };
    if (RARE_PATTERNS.LOW.test(aid)) return { rarity: 'LOW', score: 2, pattern: 'LOW' };
    return { rarity: 'NORMAL', score: 0, pattern: null };
}

async function guestRegister(password) {
    const payload = JSON.stringify({
        app_id: 100067,
        client_type: 2,
        password: password,
        source: 2
    });
    
    const signature = hmacSign(payload);
    const urls = CONNECT_URLS.map(base => base + REGISTER_PATH);
    
    for (const url of urls) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'User-Agent': 'GarenaMSDK/4.0.44(25028RN03A ;Android 15;ar;EG;app 1.132.1 2019121229;)',
                    'Connection': 'Keep-Alive',
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'Authorization': `Signature ${signature}`,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: payload
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.code === 0) {
                    console.log(`[REGISTER] Success via ${url}`);
                    return data.data.uid;
                }
            }
            console.log(`[REGISTER] ${url} returned ${response.status}`);
        } catch (e) {
            console.log(`[REGISTER] ${url} failed: ${e.message}`);
            continue;
        }
    }
    return null;
}

async function guestToken(uid, password) {
    const payload = JSON.stringify({
        client_id: 100067,
        client_secret: HEX_KEY,
        client_type: 2,
        device_id: '02-344afb0e-593c-40b7-92f2-171972f74807',
        password: password,
        response_type: 'token',
        uid: uid
    });
    
    const signature = hmacSign(payload);
    const urls = CONNECT_URLS.map(base => base + TOKEN_PATH);
    
    for (const url of urls) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'User-Agent': 'GarenaMSDK/4.0.44(25028RN03A ;Android 15;ar;EG;app 1.132.1 2019121229;)',
                    'Connection': 'Keep-Alive',
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'Authorization': `Signature ${signature}`,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: payload
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.code === 0) {
                    console.log(`[TOKEN] Success via ${url}`);
                    return {
                        access_token: data.data.access_token,
                        open_id: data.data.open_id
                    };
                }
            }
            console.log(`[TOKEN] ${url} returned ${response.status}`);
        } catch (e) {
            console.log(`[TOKEN] ${url} failed: ${e.message}`);
            continue;
        }
    }
    return null;
}

function encodeVarint(n) {
    if (n < 0) n = (1 << 64) + n;
    const bytes = [];
    while (true) {
        let byte = n & 0x7F;
        n >>>= 7;
        if (n) byte |= 0x80;
        bytes.push(byte);
        if (!n) break;
    }
    return Buffer.from(bytes);
}

function fieldVarint(fieldNum, value) {
    return Buffer.concat([encodeVarint((fieldNum << 3) | 0), encodeVarint(value)]);
}

function fieldString(fieldNum, value) {
    const encoded = Buffer.from(value, 'utf8');
    return Buffer.concat([encodeVarint((fieldNum << 3) | 2), encodeVarint(encoded.length), encoded]);
}

function fieldBytes(fieldNum, value) {
    return Buffer.concat([encodeVarint((fieldNum << 3) | 2), encodeVarint(value.length), value]);
}

function buildProto(fields) {
    const parts = [];
    for (const [k, v] of Object.entries(fields)) {
        const key = parseInt(k);
        if (typeof v === 'number') parts.push(fieldVarint(key, v));
        else if (Buffer.isBuffer(v)) parts.push(fieldBytes(key, v));
        else parts.push(fieldString(key, String(v)));
    }
    return Buffer.concat(parts);
}

function xorOpenId(openId) {
    const keystream = [
        0x30,0x30,0x30,0x32,0x30,0x31,0x37,0x30,0x30,0x30,0x30,0x30,0x32,0x30,0x31,0x37,
        0x30,0x30,0x30,0x30,0x30,0x32,0x30,0x31,0x37,0x30,0x30,0x30,0x30,0x30,0x32,0x30
    ];
    const result = Buffer.alloc(openId.length);
    for (let i = 0; i < openId.length; i++) {
        result[i] = openId.charCodeAt(i) ^ keystream[i % keystream.length];
    }
    return result;
}

async function majorRegister(accessToken, openId, name, lang) {
    const fieldBytes = xorOpenId(openId);
    
    const proto = buildProto({
        1: name,
        2: accessToken,
        3: openId,
        5: 102000007,
        6: 4,
        7: 1,
        13: 1,
        14: fieldBytes,
        15: lang,
        16: 1,
        17: 1
    });
    
    const encPayload = aesEncrypt(proto);
    const urls = LOGIN_BP_URLS.map(base => base + MAJOR_REGISTER_PATH);
    
    for (const url of urls) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'User-Agent': `UnityPlayer/${UNITY_VERSION} (UnityWebRequest/1.0, libcurl/8.5.0-DEV)`,
                    'Accept-Encoding': 'deflate, gzip',
                    'X-GA-SV': '1789535859',
                    'Authorization': 'Bearer',
                    'X-GA': 'v1 1',
                    'ReleaseVersion': RELEASE_VERSION,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Unity-Version': UNITY_VERSION
                },
                body: encPayload
            });
            
            if (response.ok) {
                console.log(`[MAJOR-REGISTER] Success via ${url}`);
                return true;
            }
            console.log(`[MAJOR-REGISTER] ${url} returned ${response.status}`);
        } catch (e) {
            console.log(`[MAJOR-REGISTER] ${url} failed: ${e.message}`);
            continue;
        }
    }
    return false;
}

async function majorLogin(accessToken, openId, lang) {
    const parts = [
        Buffer.from('1a132026-09-27 00:00:00"09free fire01:081.115.0B2Android 13 / API-33 (TP1A.220624.014)J08HandheldR0aATM MobilsZ04WIFI60b60a68ee0572033007a1fARMv7 VFPv3 NEON VMH | 2400 | 28001c90f8a010fAdreno (TM) 64092010dOpenGL ES 3.29a01+Google|dfa4ab4b-9dc4-454e-8065-e70c733fa53fa2010e105.235.139.91aa0102', 'hex'),
        Buffer.from(lang, 'ascii'),
        Buffer.from('b201203164386563303234306564653130393937336633333231623933353462343464ba010134c2010848616e6468656c64ca01104173757320415355535f493030354441ea014061666366626631333333346265343230333665346637343263383062393536333434626564373630616339316233616666396236303761363130616234333930f00101ca020a41544d204d6f62696c73d2020457494649ca03203734323862323533646566633136343031386336303461316562626665626466e003a88102e803f6e501f003af13f80384078004e7f0018804a881029004e7f0019804a88102c80401d2043d2f646174612f6170702f636f6d2e6474732e667265656669726574682d506465446e4f696c4353466e3337703141485f46673d3d2f6c69622f61726de00401ea045f32303837663631633139663537663261663465376665666630623234643964397c2f646174612f6170702f636f6d2e6474732e667265656669726574682d506465446e4f696c4353466e3337703141485f46673d3d2f626173652e61706bf00403f804018a0502329a050a32303139313138363933b205094f70656e474c455332b805ff7fc00504e005f346ea0507616e64726f6964f205704b71734854355a4c5772596c6a4e62355671682f2f7946526c615048534f394e5753517356764f6d646845456e37572b56484e554b2b512b666475413370744e724742304c6c304c527a335757306a4f7765734c6a3661695537735a34307038426655452f46492f6a7a535477526532f805fbe4068806019006019a060134a2060134b206224751404f000e5e00440655410e504d0d13685a0754060c6d5c560e6a59563b0b5535', 'hex')
    ];
    
    let rawPayload = Buffer.concat(parts);
    
    rawPayload = Buffer.from(rawPayload.toString('binary').replace(
        'afcfbf13334be42036e4f742c80b956344bed760ac91b3aff9b607a610ab4390',
        accessToken
    ), 'binary');
    
    rawPayload = Buffer.from(rawPayload.toString('binary').replace(
        '1d8ec0240ede109973f3321b9354b44d',
        openId
    ), 'binary');
    
    const encPayload = aesEncrypt(rawPayload);
    const urls = LOGIN_BP_URLS.map(base => base + MAJOR_LOGIN_PATH);
    
    for (const url of urls) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'User-Agent': `UnityPlayer/${UNITY_VERSION} (UnityWebRequest/1.0, libcurl/8.5.0-DEV)`,
                    'Accept-Encoding': 'deflate, gzip',
                    'X-GA-SV': '1789535859',
                    'Authorization': 'Bearer',
                    'X-GA': 'v1 1',
                    'ReleaseVersion': RELEASE_VERSION,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Unity-Version': UNITY_VERSION
                },
                body: encPayload
            });
            
            console.log(`[MAJOR-LOGIN] ${url} returned ${response.status}`);
            
            if (response.ok) {
                const buffer = Buffer.from(await response.arrayBuffer());
                const text = buffer.toString('binary');
                const jwtIdx = text.indexOf('eyJ');
                
                if (jwtIdx !== -1) {
                    let token = text.substring(jwtIdx);
                    const dotIdx = token.indexOf('.', token.indexOf('.') + 1);
                    if (dotIdx !== -1) {
                        token = token.substring(0, dotIdx + 44);
                        
                        try {
                            const payloadB64 = token.split('.')[1];
                            const padded = payloadB64 + '='.repeat((4 - payloadB64.length % 4) % 4);
                            const decoded = JSON.parse(Buffer.from(padded, 'base64').toString('ascii'));
                            const accId = decoded.account_id || decoded.external_id;
                            
                            if (accId) {
                                console.log(`[MAJOR-LOGIN] Success via ${url}`);
                                return { account_id: String(accId), jwt_token: token };
                            }
                        } catch (e) {
                            console.error('[MAJOR-LOGIN] JWT decode error:', e.message);
                        }
                    }
                }
            }
        } catch (e) {
            console.log(`[MAJOR-LOGIN] ${url} failed: ${e.message}`);
            continue;
        }
    }
    return null;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    
    const region = req.query.region || 'ID';
    const prefix = req.query.prefix || 'FAX';
    
    try {
        const password = genPassword();
        const name = genName(prefix);
        const lang = REGION_LANG[region.toUpperCase()] || 'en';
        
        const uid = await guestRegister(password);
        if (!uid) {
            return res.status(500).json({
                success: false,
                error: 'Guest register gagal di semua endpoint',
                step: 'register'
            });
        }
        
        const tokenData = await guestToken(uid, password);
        if (!tokenData) {
            return res.status(500).json({
                success: false,
                error: 'Guest token gagal di semua endpoint',
                step: 'token',
                uid: uid
            });
        }
        
        await majorRegister(tokenData.access_token, tokenData.open_id, name, lang);
        
        const loginData = await majorLogin(tokenData.access_token, tokenData.open_id, lang);
        
        let accountId = 'N/A';
        let jwtToken = '';
        
        if (loginData) {
            accountId = loginData.account_id;
            jwtToken = loginData.jwt_token;
        }
        
        const { rarity, score, pattern } = detectRarity(accountId);
        
        return res.status(200).json({
            success: true,
            uid: String(uid),
            account_id: accountId,
            name: name,
            password: password,
            api_name: genApiName(),
            api_password: genApiPassword(),
            region: region.toUpperCase(),
            rarity: rarity,
            rarity_score: score,
            rarity_pattern: pattern,
            api_rarity: rarity === 'NORMAL' ? 'JELEKBET' : `RARE_${rarity}`,
            jwt_token: jwtToken,
            access_token: tokenData.access_token,
            open_id: tokenData.open_id,
            created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
