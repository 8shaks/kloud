import paramiko
address = "shakiran@192.241.139.120"
# pw = "Xu0g0hTyM5he"
ssh_client = paramiko.SSHClient()
ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh_client.connect(hostname = "192.241.139.120", username="shakiran")




cmd = "npm install --prefix  kloud/front-end"

stdin, stdout, stderr = ssh_client.exec_command(cmd)
stdout = stdout.readlines()
print('Installing front end Dependencies \n\n')
for x in stdout:
    print(x)

cmd = "npm install --prefix  kloud/back-end"

stdin, stdout, stderr = ssh_client.exec_command(cmd)
stdout = stdout.readlines()
print('Installing back end Dependencies \n\n')
for x in stdout:
    print(x)

cmd = "npm run --prefix kloud/front-end build"

stdin, stdout, stderr = ssh_client.exec_command(cmd)
stdout = stdout.readlines()
print('RUNNING FRONT END BUILD \n\n')
for x in stdout:
    print(x)

print('\n\n\n\nERRORS:\n\n\n\n')
for x in stderr.readlines():
    print(x)

cmd = "pm2 restart back-end"
stdin, stdout, stderr = ssh_client.exec_command(cmd)
stdout = stdout.readlines()
print('PM2 RESTART BACKEND \n\n')
for x in stdout:
    print(x)

print('\n\n\n\nERRORS:\n\n\n\n')
for x in stderr.readlines():
    print(x)



cmd = "pm2 restart front-end"
stdin, stdout, stderr = ssh_client.exec_command(cmd)
stdout = stdout.readlines()
print('PM2 RESTART FRONTEND \n\n')
for x in stdout:
    print(x)

print('\n\n\n\nERRORS:\n\n\n\n')
for x in stderr.readlines():
    print(x)