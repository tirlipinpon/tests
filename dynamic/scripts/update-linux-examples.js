// Script pour améliorer les exemples des questions Linux avec des sorties concrètes
// Usage: node update-linux-examples.js

const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase (à adapter selon votre configuration)
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Nouvelles données d'exemples améliorés
const improvedExamples = {
  'linux-001': `pwd
# Sortie concrète :
/home/tony

# Explication :
# Affiche le chemin absolu du répertoire courant`,

  'linux-002': `mkdir monDossier
# Sortie concrète :
# (aucune sortie si succès)

# Vérification :
ls -la | grep monDossier
# Sortie :
drwxr-xr-x 2 tony tony 4096 oct 24 10:30 monDossier

# Explication :
# - d = dossier
# - rwxr-xr-x = permissions (propriétaire: lecture/écriture/exécution, autres: lecture/exécution)
# - 2 = nombre de liens
# - tony tony = propriétaire:groupe`,

  'linux-003': `df -h
# Sortie concrète :
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        20G  8.2G   11G  44% /
/dev/sda2       100G   45G   50G  48% /home
tmpfs           2.0G     0  2.0G   0% /dev/shm

# Explication des colonnes :
# Filesystem = partition
# Size = taille totale
# Used = espace utilisé
# Avail = espace disponible
# Use% = pourcentage utilisé
# Mounted on = point de montage`,

  'linux-004': `sudo systemctl start nginx
# Vérification du statut :
sudo systemctl status nginx
# Sortie :
● nginx.service - A high performance web server
   Active: active (running) since Mon 2024-10-24 10:30:00 UTC
   Main PID: 1234 (nginx)
   Tasks: 2 (limit: 4915)
   Memory: 2.1M
   CGroup: /system.slice/nginx.service
           ├─1234 nginx: master process /usr/sbin/nginx
           └─1235 nginx: worker process

# Explication :
# ● = service actif
# Active: active (running) = service en cours d'exécution
# Main PID = Process ID principal`,

  'linux-005': `sudo adduser akira
# Sortie interactive :
Adding user 'akira' ...
Adding new group 'akira' (1001) ...
Adding new user 'akira' (1001) with group 'akira' ...
Creating home directory /home/akira ...
Copying files from /etc/skel ...
New password: [saisie du mot de passe]
Retype new password: [confirmation]
passwd: password updated successfully
Changing the user information for akira
Enter the new value, or press ENTER for the default
        Full Name []: Akira Tanaka
        Room Number []: 
        Work Phone []: 
        Home Phone []: 
        Other []: 
Is the information correct? [Y/n] Y

# Vérification :
id akira
# Sortie :
uid=1001(akira) gid=1001(akira) groups=1001(akira)`,

  'linux-006': `ls -la
# Sortie concrète :
total 48
drwxr-xr-x  5 tony tony  4096 oct 24 09:00 .
drwxr-xr-x  3 tony tony  4096 oct 20 14:30 ..
-rw-r--r--  1 tony tony  1024 oct 24 08:45 .bashrc
-rw-r--r--  1 tony tony   220 oct 24 08:45 .profile
drwxr-xr-x  2 tony tony  4096 oct 24 09:00 Documents
-rw-r--r--  1 tony tony  2048 oct 24 08:50 fichier.txt
-rwxr-xr-x  1 tony tony  1024 oct 24 09:00 script.sh

# Explication des colonnes :
# 1. drwxr-xr-x → droits d'accès (d=dossier, -=fichier, r=lecture, w=écriture, x=exécution)
# 2. 5 → nombre de liens
# 3. tony → propriétaire
# 4. tony → groupe
# 5. 4096 → taille en octets
# 6. oct 24 09:00 → date et heure de modification
# 7. . ou .. ou nom → nom du fichier/dossier`,

  'linux-007': `free -m
# Sortie concrète :
              total        used        free      shared  buff/cache   available
Mem:           2048        1024         512          64         512        1408
Swap:          1024           0        1024

# Explication :
# Mem = mémoire RAM
# total = mémoire totale (2048 MB = 2 GB)
# used = mémoire utilisée (1024 MB = 1 GB)
# free = mémoire libre (512 MB)
# shared = mémoire partagée (64 MB)
# buff/cache = mémoire utilisée pour les buffers et cache (512 MB)
# available = mémoire réellement disponible (1408 MB)
# Swap = mémoire virtuelle sur disque`,

  'linux-008': `chmod 755 monfichier.txt
# Vérification :
ls -l monfichier.txt
# Sortie :
-rwxr-xr-x 1 tony tony 1024 oct 24 10:30 monfichier.txt

# Explication des permissions 755 :
# 7 (propriétaire) = 4(r) + 2(w) + 1(x) = lecture + écriture + exécution
# 5 (groupe) = 4(r) + 0(w) + 1(x) = lecture + exécution
# 5 (autres) = 4(r) + 0(w) + 1(x) = lecture + exécution

# Autres exemples :
chmod 644 fichier.txt    # rw-r--r--
chmod 600 fichier.txt    # rw------- (propriétaire seulement)`,

  'linux-009': `ping 8.8.8.8
# Sortie concrète :
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=54 time=12.3 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=54 time=11.8 ms
64 bytes from 8.8.8.8: icmp_seq=3 ttl=54 time=12.1 ms
^C
--- 8.8.8.8 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2002ms
rtt min/avg/max/mdev = 11.800/12.067/12.300/0.200 ms

# Explication :
# icmp_seq = numéro de séquence du paquet
# ttl = Time To Live (nombre de sauts réseau)
# time = temps de réponse en millisecondes
# 0% packet loss = aucun paquet perdu`,

  'linux-010': `sudo netstat -tuln
# Sortie concrète :
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:22             0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:80             0.0.0.0:*               LISTEN
tcp        0      0 127.0.0.1:3306         0.0.0.0:*               LISTEN
tcp6       0      0 :::22                   :::*                    LISTEN
udp        0      0 0.0.0.0:68             0.0.0.0:*
udp        0      0 0.0.0.0:123            0.0.0.0:*

# Explication :
# Proto = protocole (tcp/udp)
# Local Address = adresse locale (0.0.0.0 = toutes interfaces)
# :22 = port 22 (SSH)
# :80 = port 80 (HTTP)
# :3306 = port 3306 (MySQL)
# State = état de la connexion (LISTEN = en écoute)`,

  'linux-011': `tail -f /var/log/syslog
# Sortie concrète (exemple) :
Oct 24 10:30:15 ubuntu systemd[1]: Started Network Manager Script Dispatcher Service.
Oct 24 10:30:16 ubuntu NetworkManager[1234]: <info>  [1698147016.1234] dhcp4 (eth0): option domain_name_servers => '8.8.8.8 8.8.4.4'
Oct 24 10:30:16 ubuntu NetworkManager[1234]: <info>  [1698147016.1234] dhcp4 (eth0): option routers => '192.168.1.1'
Oct 24 10:30:17 ubuntu systemd[1]: Started CUPS Scheduler.
Oct 24 10:30:18 ubuntu kernel: [12345.678] usb 1-1: new high-speed USB device number 2 using ehci-pci

# Explication :
# Format : Mois Jour Heure:Minute:Seconde Hostname Service[PID]: Message
# -f = follow (suit les nouvelles entrées en temps réel)
# Ctrl+C pour arrêter`,

  'linux-012': `sudo apt update && sudo apt upgrade -y
# Sortie concrète :
Hit:1 http://archive.ubuntu.com/ubuntu focal InRelease
Get:2 http://archive.ubuntu.com/ubuntu focal-updates InRelease [114 kB]
Get:3 http://archive.ubuntu.com/ubuntu focal-security InRelease [109 kB]
Fetched 223 kB in 2s (111 kB/s)
Reading package lists... Done
Building dependency tree
Reading state information... Done
3 packages can be upgraded. Run 'apt list --upgradable' to see them.

# Puis pour l'upgrade :
Reading package lists... Done
Building dependency tree
Reading state information... Done
Calculating upgrade... Done
The following packages will be upgraded:
  libssl1.1 openssl python3-requests
3 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
Need to get 1,234 kB of archives.
After this operation, 567 kB of additional disk space will be used.
Do you want to continue? [Y/n] y

# Explication :
# update = met à jour la liste des paquets disponibles
# upgrade = installe les mises à jour
# -y = répond automatiquement "oui" aux questions`,

  'linux-013': `ip a
# Sortie concrète :
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:16:3e:12:34:56 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.100/24 brd 192.168.1.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::216:3eff:fe12:3456/64 scope link
       valid_lft forever preferred_lft forever

# Explication :
# lo = interface loopback (127.0.0.1)
# eth0 = interface Ethernet
# inet = adresse IPv4 (192.168.1.100/24)
# inet6 = adresse IPv6
# /24 = masque de sous-réseau (255.255.255.0)`,

  'linux-014': `rm monfichier.txt
# Sortie :
# (aucune sortie si succès)

# Vérification :
ls monfichier.txt
# Sortie :
ls: cannot access 'monfichier.txt': No such file or directory

# Exemples avec options :
rm -r dossier/          # Supprime un dossier et son contenu
rm -f fichier.txt       # Force la suppression sans demander confirmation
rm -i *.txt             # Demande confirmation pour chaque fichier .txt`,

  'linux-015': `cp fichier.txt /home/tony/test/
# Vérification :
ls -la /home/tony/test/
# Sortie :
total 8
drwxr-xr-x 2 tony tony 4096 oct 24 10:30 .
drwxr-xr-x 3 tony tony 4096 oct 24 10:25 ..
-rw-r--r-- 1 tony tony 1024 oct 24 10:30 fichier.txt

# Autres exemples :
cp fichier.txt fichier_backup.txt    # Renomme en copiant
cp -r dossier/ dossier_backup/       # Copie récursive d'un dossier
cp -p fichier.txt backup/            # Préserve les permissions et timestamps`,

  'linux-016': `mv ancien.txt nouveau.txt
# Vérification :
ls -la *.txt
# Sortie :
-rw-r--r-- 1 tony tony 1024 oct 24 10:30 nouveau.txt

# Autres exemples :
mv fichier.txt /home/tony/Documents/    # Déplace vers un dossier
mv *.txt backup/                        # Déplace tous les .txt vers backup/
mv fichier.txt fichier.txt.bak          # Renomme avec extension .bak`,

  'linux-017': `whoami
# Sortie concrète :
tony

# Autres commandes utiles :
who
# Sortie :
tony    pts/0        2024-10-24 10:30 (192.168.1.50)

# Explication :
# whoami = nom d'utilisateur actuel
# who = utilisateurs connectés avec terminal et adresse IP`,

  'linux-018': `sudo chown tony:tony monfichier.txt
# Vérification :
ls -l monfichier.txt
# Sortie :
-rw-r--r-- 1 tony tony 1024 oct 24 10:30 monfichier.txt

# Autres exemples :
sudo chown tony fichier.txt           # Change seulement le propriétaire
sudo chown :developers fichier.txt    # Change seulement le groupe
sudo chown -R tony:tony dossier/      # Récursif sur tout le dossier`,

  'linux-019': `tail -f /var/log/syslog
# Sortie en temps réel (exemple) :
Oct 24 10:30:15 ubuntu systemd[1]: Started Network Manager Script Dispatcher Service.
Oct 24 10:30:16 ubuntu NetworkManager[1234]: <info>  [1698147016.1234] dhcp4 (eth0): option domain_name_servers => '8.8.8.8 8.8.4.4'
Oct 24 10:30:17 ubuntu systemd[1]: Started CUPS Scheduler.
Oct 24 10:30:18 ubuntu kernel: [12345.678] usb 1-1: new high-speed USB device number 2 using ehci-pci
Oct 24 10:30:19 ubuntu systemd[1]: Started snapd.service.
^C

# Explication :
# -f = follow (suit les nouvelles entrées)
# Affiche les logs en temps réel
# Ctrl+C pour arrêter
# Utile pour déboguer en temps réel`,

  'linux-020': `route -n
# Sortie concrète :
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         192.168.1.1    0.0.0.0         UG    100    0        0 eth0
192.168.1.0     0.0.0.0        255.255.255.0   U     100    0        0 eth0
169.254.0.0     0.0.0.0        255.255.0.0     U     1000   0        0 eth0

# Explication :
# Destination = réseau de destination
# Gateway = passerelle (routeur)
# Genmask = masque de sous-réseau
# Flags = U (up), G (gateway)
# Iface = interface réseau (eth0)

# Autres commandes :
ip route show
# Sortie :
default via 192.168.1.1 dev eth0 proto dhcp metric 100
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100 metric 100`,

  'linux-021': `# Exemple d'URL HTTPS :
https://www.ubuntu.com

# Vérification avec curl :
curl -I https://www.ubuntu.com
# Sortie :
HTTP/2 200 
server: nginx/1.18.0 (Ubuntu)
date: Mon, 24 Oct 2024 10:30:00 GMT
content-type: text/html; charset=UTF-8
content-length: 12345
strict-transport-security: max-age=31536000; includeSubDomains
x-frame-options: SAMEORIGIN

# Explication :
# HTTP/2 = protocole HTTP version 2
# 200 = code de statut (succès)
# strict-transport-security = force HTTPS
# HTTPS = HTTP + SSL/TLS (chiffrement)`,

  'linux-022': `nslookup ubuntu.com
# Sortie concrète :
Server:		8.8.8.8
Address:	8.8.8.8#53

Non-authoritative answer:
Name:	ubuntu.com
Address: 91.189.91.38
Address: 91.189.91.39

# Avec dig :
dig ubuntu.com
# Sortie :
; <<>> DiG 9.16.1-Ubuntu <<>> ubuntu.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345
;; flags: qr rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 1

;; QUESTION SECTION:
;ubuntu.com.			IN	A

;; ANSWER SECTION:
ubuntu.com.		300	IN	A	91.189.91.38
ubuntu.com.		300	IN	A	91.189.91.39

# Explication :
# nslookup = outil simple pour résolution DNS
# dig = outil plus détaillé avec plus d'informations
# 300 = TTL (Time To Live) en secondes
# A = enregistrement de type A (IPv4)`
};

// Fonction pour mettre à jour les exemples
async function updateLinuxExamples() {
  console.log('🚀 Début de la mise à jour des exemples Linux...');
  
  for (const [questionId, newExample] of Object.entries(improvedExamples)) {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .update({ exemple: newExample })
        .eq('question_id', questionId)
        .eq('category', 'linux-commandes');

      if (error) {
        console.error(`❌ Erreur pour ${questionId}:`, error);
      } else {
        console.log(`✅ ${questionId} mis à jour avec succès`);
      }
    } catch (err) {
      console.error(`❌ Exception pour ${questionId}:`, err);
    }
  }
  
  console.log('🎉 Mise à jour terminée !');
}

// Exécuter le script
updateLinuxExamples();
