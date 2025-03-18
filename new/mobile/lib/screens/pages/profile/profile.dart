import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: Get.width,
      height: Get.height,
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(FeatherIcons.user),
              const SizedBox(width: 10),
              Text(
                "Profile",
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Expanded(
            child: ListView(
              children: [
                CircleAvatar(
                  radius: 50,
                  backgroundColor: primaryColor,
                  child: Icon(
                    FeatherIcons.user,
                    size: 50,
                    color: Colors.white,
                  ),
                ),
                ListTile(
                  title: Text("Name"),
                  subtitle: Text("John Doe"),
                ),
                ListTile(
                  title: Text("Email"),
                  subtitle: Text("johndoe@example.com"),
                ),
                Divider(
                  height: 50,
                ),
                Text("Usages & Limits"),
                SizedBox(
                  height: 20,
                ),
                Container(
                  padding: EdgeInsets.symmetric(vertical: 5, horizontal: 15),
                  child: Row(
                    children: [
                      Icon(
                        FeatherIcons.play,
                        size: 18,
                        color: secondaryColor,
                      ),
                      SizedBox(
                        width: 10,
                      ),
                      Text(
                        "Evaluators: 1 / 5",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(
                  height: 20,
                ),
                Container(
                  padding: EdgeInsets.symmetric(vertical: 5, horizontal: 15),
                  child: Row(
                    children: [
                      Icon(
                        FeatherIcons.edit,
                        size: 18,
                        color: secondaryColor,
                      ),
                      SizedBox(
                        width: 10,
                      ),
                      Text(
                        "Evaluations: 1 / 5",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(
                  height: 20,
                ),
                Container(
                  padding: EdgeInsets.symmetric(vertical: 5, horizontal: 15),
                  child: Row(
                    children: [
                      Icon(
                        FeatherIcons.users,
                        size: 18,
                        color: secondaryColor,
                      ),
                      SizedBox(
                        width: 10,
                      ),
                      Text(
                        "Classes: 1 / 5",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                Divider(
                  height: 50,
                ),
                TextButton.icon(
                  onPressed: () {},
                  style: TextButton.styleFrom(
                    foregroundColor: Colors.red,
                  ),
                  icon: Icon(FeatherIcons.logOut),
                  label: Text("Logout"),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
