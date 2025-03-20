import 'package:evaluateai/providers/user.dart';
import 'package:evaluateai/utils/colors.dart';
import 'package:evaluateai/utils/utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  @override
  void initState() {
    Provider.of<UserProvider>(Get.context!, listen: false).getProfile();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    var userProvider = Provider.of<UserProvider>(context, listen: true);

    return Container(
      width: Get.width,
      height: Get.height,
      padding: const EdgeInsets.all(20),
      child: userProvider.loading && userProvider.profile.isEmpty
          ? Center(child: CircularProgressIndicator())
          : Column(
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
                        subtitle: Text(userProvider.profile["name"]),
                      ),
                      ListTile(
                        title: Text("Email"),
                        subtitle: Text(userProvider.profile["email"]),
                      ),
                      Divider(
                        height: 50,
                      ),
                      Text("Usages & Limits"),
                      SizedBox(
                        height: 20,
                      ),
                      Container(
                        padding:
                            EdgeInsets.symmetric(vertical: 5, horizontal: 15),
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
                              "Evaluators: ${userProvider.limits["evaluatorUsage"]} / ${userProvider.limits["evaluatorLimit"]}",
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
                        padding:
                            EdgeInsets.symmetric(vertical: 5, horizontal: 15),
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
                              "Evaluations: ${userProvider.limits["evaluationUsage"]} / ${userProvider.limits["evaluationLimit"]}",
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
                        padding:
                            EdgeInsets.symmetric(vertical: 5, horizontal: 15),
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
                              "Classes: ${userProvider.limits["classesUsage"]} / ${userProvider.limits["classesLimit"]}",
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
                        onPressed: () {
                          showDialog(
                              context: context,
                              builder: (context) {
                                return AlertDialog(
                                  title: Row(
                                    children: [
                                      Icon(FeatherIcons.logOut),
                                      const SizedBox(
                                        width: 5,
                                      ),
                                      Text("Logout"),
                                    ],
                                  ),
                                  content: Text(
                                    "Are you sure you want to logout?",
                                  ),
                                  actions: [
                                    TextButton(
                                      onPressed: () {
                                        Get.back();
                                      },
                                      child: Text("Cancel"),
                                    ),
                                    TextButton(
                                      onPressed: () {
                                        Provider.of<UserProvider>(context,
                                                listen: false)
                                            .logOut();
                                      },
                                      child: Text(
                                        "Logout",
                                        style: TextStyle(
                                          color: Colors.red,
                                        ),
                                      ),
                                    ),
                                  ],
                                );
                              });
                        },
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
