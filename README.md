# Amazon Linux EC2 Visual™ – The Git Bash SSH Mission
Launch. Authenticate. Connect. Deploy. Open `index.html` in a browser (no build step). Works on GitHub Pages (`.nojekyll` included).

**Educational simulation:** no AWS credentials or private keys are used and no real commands run.

## Connect from Windows (run in Git Bash)
```
cd ~/Downloads
chmod 400 cloud-messenger-key.pem
ssh -i cloud-messenger-key.pem ec2-user@<EC2-PUBLIC-IP>
```
Git Bash includes OpenSSH, so the AWS `.pem` works directly; no PuTTY, PuTTYgen or PPK. Verify the host fingerprint before accepting it.

## Deploy (run inside Amazon Linux, not on Windows)
```
sudo dnf update -y
sudo dnf install git nginx -y
git clone https://github.com/Cloud-Messenger/amazon-linux-gitbash-visual.git
sudo cp -r amazon-linux-gitbash-visual/* /var/www/html/
sudo systemctl enable --now nginx
```
Security Group: SSH 22 from My IP; HTTP 80 from 0.0.0.0/0 only if public.

Created by Cloud Messenger™ · https://cloudmessenger.in/ · https://github.com/Cloud-Messenger · © 2026 Cloud Messenger. Third-party trademarks belong to their owners.
