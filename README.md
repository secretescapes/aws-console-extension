# ![icon](icons/icon24.png) aws-console-extension

The `aws-console-extension` is designed for users who have to frequently work in multiple AWS account, and different regions.

# Functionality

## Region Warning

AWS sometimes switchs your current region without your knowledge, which can cause you to waste time looking for resources that seemly do not exist!

To activate Region Warning:

1. Go to the **options** page.
1. Under **Regions**, check the **Region Warning** box.
1. Select any of the regions you usually work in.

Now for any region not selected, the region icon on the top right of the screen will flash red/white.


# Role Switching

Working within the AWS Console can be pain if your organization works with multiple subaccounts and role based access within those accounts; there is a hard limit of 5 roles in the role history.

This extension allows you to quickly switch between any number of AWS IAM roles in any account, assuming you're part of a top-level organization.

## Popup

Click the mask icon ![mask](images/tragedy.png) in the AWS topbar or use the keyboard shortcut, `ctrl+y`, to trigger the popup.

## Configuration

You can configure your role switching from the **options** page.

### Edit

1. Go to the **options page**.
1. Under **Accounts** click the **Edit** button.
1. Make any changes, then click the **Save** button.

From the Edit screen you can update, modify, and remove any account role switching configuration:

- `group` will group together any role configurations you feel are similar. The group name acts as the prefix for the role identifier.
- `Accound ID` is that of your AWS account you're switching to.
- `Role Name` is the name of the role you're switching to.
- `Description` is optional, but can be added to provide additional context to the role identifer, it is post-fixed to the `group`.
- `hexcolor` is the color you want your role to appear in the AWS console.


### Export

If you click the `Download JSON` button, it will export your Accounts configuration to a JSON file. In the following format:

```
{
  "group_name": [
    {
      "account": "accound_id",
      "role": "role_name",
      "description": "description",
      "color": "hexcolor"
    }
  ]
}
```

### Import

You can import Accounts configuration using a JSON file in the same format described above.