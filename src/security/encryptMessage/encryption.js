import * as openpgp from 'openpgp';

// Mã hóa tin nhắn
export async function encryptMessage(publicKeyArmored, message) {
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: message }),
        encryptionKeys: publicKey
    });
    return encrypted;
}

// Mã hóa tin nhắn với Public Key của tất cả thành viên nhóm
export async function encryptGroupMessage(groupPublicKeys, message) {
    const publicKeys = await Promise.all(groupPublicKeys.map(async (key) => await openpgp.readKey({ armoredKey: key })));

    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: message }),
        encryptionKeys: publicKeys,
    });

    return encrypted;
}

// Giải mã tin nhắn
export async function decryptMessage(privateKeyArmored, encryptedMessage) {
    const privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });
    const message = await openpgp.readMessage({ armoredMessage: encryptedMessage });

    const { data: decrypted } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey
    });

    return decrypted;
}
