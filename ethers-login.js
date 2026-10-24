const server_url = "/ethers-login-auth";
let authToken = null;

const EthersAuth = {
    initAuth: async function(callback) {
        if (typeof window.ethereum === 'undefined') {
            console.error("MetaMask not detected.");
            document.body.innerHTML = "<h1 style='color:white;background:#111;text-align:center;padding:50px;'>403 Forbidden: MetaMask Required</h1>";
            if (typeof callback === 'function') callback(false);
            return;
        }

        try {
            // 1. Prompt MetaMask connection & Ethers provider
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            // 2. Sign SIWE message
            const message = `Authenticate EmeraldTemple Session\nTimestamp: ${Date.now()}`;
            const signature = await signer.signMessage(message);

            // 3. Post to /access-ctrl verification route
            const response = await $.ajax({
                url: server_url,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({ address, signature, message })
            });

            if (response && response.success) {
                authToken = response.token;

                // Automatically attach x-auth-token to all future jQuery AJAX requests
                $.ajaxSetup({
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('x-auth-token', authToken);
                    }
                });

                console.log("Cryptographic authentication successful!");
                if (typeof callback === 'function') callback(true);
            } else {
                throw new Error(response ? response.error : "Authentication failed.");
            }
        } catch (err) {
            console.error("Authentication error:", err);
            document.body.innerHTML = `<h1 style='color:white;background:#111;text-align:center;padding:50px;'>Access Denied: ${err.message || "Auth Failed"}</h1>`;
            if (typeof callback === 'function') callback(false);
        }
    }
};