// @ts-ignore
import sha256 from 'crypto-js/sha256';
import macaddress from 'macaddress';
import fetch from 'node-fetch';

const measurement_id = `G-3VBWD4V1JX`;
const api_secret = `KXIe32DtSvWX1OFrjchz5g`;
const version = process.env.VUERD_VSCODE_VERSION || 'NONE';

let client_id: string | null = null;

function getClientId(): Promise<string> {
  if (client_id) {
    return Promise.resolve(client_id);
  }

  return macaddress.one().then(mac => {
    const clientId = sha256(mac).toString();
    client_id = clientId;
    return clientId;
  });
}

function send(action: string) {
  getClientId().then(clientId => {
    fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}`,
      {
        method: 'POST',
        body: JSON.stringify({
          client_id: clientId,
          events: [
            {
              name: 'select_content',
              params: {
                content_type: 'vscode',
                content_id: action,
                vscode_extension_version: version,
              },
            },
          ],
        }),
      }
    );
  });
}

export function trackEvent(action: string) {
  send(action);
}
