// This project uses the nodemailer library to send email
// However, it is recommended to switch over to dedicated email services
// like Mailgun, AWS SES, etc.
import nodemailer from 'nodemailer';

const nodemailerConfig = process.env.NODEMAILER_CONFIG
  ? JSON.parse(process.env.NODEMAILER_CONFIG)
  : {};

const transporter = nodemailer.createTransport(nodemailerConfig);

export async function sendMail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: 'no-reply@repeato.app',
      to,
      subject: `Repeato - ${subject}`,
      html,
    });
  } catch (e) {
    throw new Error(`Could not send email: ${e.message}`);
  }
}

export const CONFIG = {
  // TODO: Replace with the email you want to use to send email
  from: nodemailerConfig?.auth?.user,
};

// available templates: confirmEmail, resetPassword, inviteExistingUser, inviteNewUser
export function templates(type = 'confirmEmail', replacements = {}) {
  let template = '';

  if (type === 'confirmEmail') {
    template = `<!DOCTYPE html>

<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">

<head>
	<title></title>
	<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
	<meta content="width=device-width, initial-scale=1.0" name="viewport" />
	<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		@media (max-width:520px) {
			.desktop_hide table.icons-inner {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.fullMobileWidth,
			.row-content {
				width: 100% !important;
			}

			.mobile_hide {
				display: none;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}
		}
	</style>
</head>

<body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;" width="100%">
		<tbody>
			<tr>
				<td>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation"
						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 500px;"
										width="500">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="30" cellspacing="0" class="image_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
														<tr>
															<td>
																<div align="center" style="line-height:10px"><img class="fullMobileWidth"
																		src="https://www.repeato.app/wp-content/uploads/2022/06/Repeato-Logo-Dark-Smaller.png"
																		style="display: block; height: auto; border: 0; width: 225px; max-width: 100%;"
																		width="225" /></div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0" class="heading_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
														<tr>
															<td style="padding-bottom:30px;text-align:center;width:100%;">
																<h1
																	style="margin: 0; color: #1e4158; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 23px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;">
																	<span class="tinyMce-placeholder">Welcome, it's great to have you
																		aboard!<br /></span>
																</h1>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
														<tr>
															<td style="padding-bottom:20px;">
																<div
																	style="color:#101112;font-size:16px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:19.2px;">
																	<p style="margin: 0;">First, you need to confirm your account. Just press the button
																		below:</p>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
														<tr>
															<td style="padding-bottom:25px;">
																<div
																	style="color:#000000;font-size:20px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:3px;mso-line-height-alt:24px;">
																	<p style="margin: 0;"><span><a style="color: #10a4da" href="{{confirmLink}}">Confirm
																				Account</a></span>
																	</p>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
														<tr>
															<td style="padding-bottom:20px;">
																<div
																	style="color:#101112;font-size:16px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:19.2px;">
																	<p style="margin: 0;">You are receiving this email because you recently created a new
																		Repeato account. If this was not you, please contact us to unsubscribe at <a
																			href="mailto:support@repeato.app" rel="noopener"
																			style="text-decoration: underline; color: #10a4da;"
																			target="_blank">support@repeato.app</a><br /><br />Thanks,<br />Your friends at
																		Repeato</p>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="10" cellspacing="0" class="divider_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
														<tr>
															<td>
																<div align="center">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
																		<tr>
																			<td class="divider_inner"
																				style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;">
																			</td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
														<tr>
															<td>
																<div
																	style="color:#000000;font-size:14px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:16.8px;">
																	<p style="margin: 0;">Repeato - Test Automation Simplified<br />Horeischygasse
																		13<br />1130 Vienna, Austria</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation"
						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0" class="icons_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
														<tr>
															<td
																style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
																<table cellpadding="0" cellspacing="0" role="presentation"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
																	<tr>
																		<td style="vertical-align: middle; text-align: center;">
																			<!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
																			<!--[if !vml]><!-->
																			<table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation"
																				style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">
																				<!--<![endif]-->
																				<tr>
																				</tr>
																			</table>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table><!-- End -->
</body>

</html>
`;
  }

  if (type === 'resetPassword') {
    template = `<!DOCTYPE html>

<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">

<head>
	<title></title>
	<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
	<meta content="width=device-width, initial-scale=1.0" name="viewport" />
	<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		@media (max-width:520px) {
			.desktop_hide table.icons-inner {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.fullMobileWidth,
			.row-content {
				width: 100% !important;
			}

			.mobile_hide {
				display: none;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}
		}
	</style>
</head>

<body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;" width="100%">
		<tbody>
			<tr>
				<td>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation"
						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 500px;"
										width="500">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="30" cellspacing="0" class="image_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
														<tr>
															<td>
																<div align="center" style="line-height:10px"><img class="fullMobileWidth"
																		src="https://www.repeato.app/wp-content/uploads/2022/06/Repeato-Logo-Dark-Smaller.png"
																		style="display: block; height: auto; border: 0; width: 225px; max-width: 100%;"
																		width="225" /></div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0" class="heading_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
														<tr>
															<td style="padding-bottom:30px;text-align:center;width:100%;">
																<h1
																	style="margin: 0; color: #1e4158; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 23px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;">
																	<span class="tinyMce-placeholder">Hi {{name}}, We recieved your request to reset
																		password!<br /></span>
																</h1>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
														<tr>
															<td style="padding-bottom:20px;">
																<div
																	style="color:#101112;font-size:16px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:19.2px;">
																	<p style="margin: 0;">We cannot simply send you your old password. A unique link to
																		reset your password has been generated for you. To reset
																		your password, click the following link and follow the instructions:</p>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
														<tr>
															<td style="padding-bottom:25px;">
																<div
																	style="color:#000000;font-size:20px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:3px;mso-line-height-alt:24px;">
																	<p style="margin: 0;"><span><a style="color: #10a4da" href="{{resetLink}}">Reset
																				Password</a></span>
																	</p>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
														<tr>
															<td style="padding-bottom:20px;">
																<div
																	style="color:#101112;font-size:16px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:19.2px;">
																	<p style="margin: 0;">You are receiving this email because you recently requested for
																		password reset. If this was not you, please contact us to unsubscribe at <a
																			href="mailto:support@repeato.app" rel="noopener"
																			style="text-decoration: underline; color: #10a4da;"
																			target="_blank">support@repeato.app</a><br /><br />Thanks,<br />Your friends at
																		Repeato</p>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="10" cellspacing="0" class="divider_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
														<tr>
															<td>
																<div align="center">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
																		<tr>
																			<td class="divider_inner"
																				style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;">

																			</td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
														<tr>
															<td>
																<div
																	style="color:#000000;font-size:14px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:16.8px;">
																	<p style="margin: 0;">Repeato - Test Automation Simplified<br />Horeischygasse
																		13<br />1130 Vienna, Austria</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation"
						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0" class="icons_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
														<tr>
															<td
																style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
																<table cellpadding="0" cellspacing="0" role="presentation"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
																	<tr>
																		<td style="vertical-align: middle; text-align: center;">
																			<!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
																			<!--[if !vml]><!-->
																			<table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation"
																				style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">
																				<!--<![endif]-->
																				<tr>
																				</tr>
																			</table>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table><!-- End -->
</body>

</html>`;
  }

  if (type === 'inviteExistingUser') {
    template = `<!DOCTYPE html>

<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">

<head>
	<title></title>
	<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
	<meta content="width=device-width, initial-scale=1.0" name="viewport" />
	<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		@media (max-width:520px) {
			.desktop_hide table.icons-inner {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.fullMobileWidth,
			.row-content {
				width: 100% !important;
			}

			.mobile_hide {
				display: none;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}
		}
	</style>
</head>

<body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;" width="100%">
		<tbody>
			<tr>
				<td>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation"
						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 500px;"
										width="500">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="30" cellspacing="0" class="image_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
														<tr>
															<td>
																<div align="center" style="line-height:10px"><img class="fullMobileWidth"
																		src="https://www.repeato.app/wp-content/uploads/2022/06/Repeato-Logo-Dark-Smaller.png"
																		style="display: block; height: auto; border: 0; width: 225px; max-width: 100%;"
																		width="225" /></div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0" class="heading_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
														<tr>
															<td style="padding-bottom:30px;text-align:center;width:100%;">
																<h1
																	style="margin: 0; color: #1e4158; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 23px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;">
																	<span class="tinyMce-placeholder">Hi {{name}}, you just got added to the Repeato team
																		of {{senderName}} ({{senderCompany}})!<br /></span>
																</h1>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
														<tr>
															<td style="padding-bottom:20px;">
																<div
																	style="color:#101112;font-size:16px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:19.2px;">
																	<p style="margin: 0;">If this is a mistake, please remove yourself using below link:
																	</p>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
														<tr>
															<td style="padding-bottom:25px;">
																<div
																	style="color:#000000;font-size:20px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:3px;mso-line-height-alt:24px;">
																	<p style="margin: 0;"><span><a style="color: #10a4da" href="{{removeLink}}">Exit
																				Team</a></span>
																	</p>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
														<tr>
															<td style="padding-bottom:20px;">
																<div
																	style="color:#101112;font-size:16px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:19.2px;">
																	<p style="margin: 0;">You are receiving this email because you recently got invited
																		to join another Repeato team. Please contact us to unsubscribe at <a
																			href="mailto:support@repeato.app" rel="noopener"
																			style="text-decoration: underline; color: #10a4da;"
																			target="_blank">support@repeato.app</a><br /><br />Thanks,<br />Your friends at
																		Repeato</p>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="10" cellspacing="0" class="divider_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
														<tr>
															<td>
																<div align="center">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
																		<tr>
																			<td class="divider_inner"
																				style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;">

																			</td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
														<tr>
															<td>
																<div
																	style="color:#000000;font-size:14px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:16.8px;">
																	<p style="margin: 0;">Repeato - Test Automation Simplified<br />Horeischygasse
																		13<br />1130 Vienna, Austria</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation"
						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0" class="icons_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
														<tr>
															<td
																style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
																<table cellpadding="0" cellspacing="0" role="presentation"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
																	<tr>
																		<td style="vertical-align: middle; text-align: center;">
																			<!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
																			<!--[if !vml]><!-->
																			<table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation"
																				style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">
																				<!--<![endif]-->
																				<tr>
																				</tr>
																			</table>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table><!-- End -->
</body>

</html>`;
  }

  if (type === 'inviteNewUser') {
    template = `<!DOCTYPE html>

<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">

<head>
	<title></title>
	<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
	<meta content="width=device-width, initial-scale=1.0" name="viewport" />
	<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		@media (max-width:520px) {
			.desktop_hide table.icons-inner {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.fullMobileWidth,
			.row-content {
				width: 100% !important;
			}

			.mobile_hide {
				display: none;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}
		}
	</style>
</head>

<body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;" width="100%">
		<tbody>
			<tr>
				<td>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation"
						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 500px;"
										width="500">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="30" cellspacing="0" class="image_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
														<tr>
															<td>
																<div align="center" style="line-height:10px"><img class="fullMobileWidth"
																		src="https://www.repeato.app/wp-content/uploads/2022/06/Repeato-Logo-Dark-Smaller.png"
																		style="display: block; height: auto; border: 0; width: 225px; max-width: 100%;"
																		width="225" /></div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0" class="heading_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
														<tr>
															<td style="padding-bottom:30px;text-align:center;width:100%;">
																<h1
																	style="margin: 0; color: #1e4158; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 23px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;">
																	<span class="tinyMce-placeholder">Hi {{name}}, you just got invited to join the
																		Repeato Test Automation team of user {{senderName}} ({{senderCompany}})<br /></span>
																</h1>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
														<tr>
															<td style="padding-bottom:20px;">
																<div
																	style="color:#101112;font-size:16px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:19.2px;">
																	<p style="margin: 0;">In order to join the team signup on REPEATO, please use
																		below signup link:</p>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
														<tr>
															<td style="padding-bottom:25px;">
																<div
																	style="color:#000000;font-size:20px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:3px;mso-line-height-alt:24px;">
																	<p style="margin: 0;"><span><a style="color: #10a4da" href="{{confirmLink}}">Signup & Join</a></span>
																	</p>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
														<tr>
															<td style="padding-bottom:20px;">
																<div
																	style="color:#101112;font-size:16px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:19.2px;">
																	<p style="margin: 0;">You are receiving this email because you recently got invited to
																		join Repeato. Please contact us to unsubscribe at
																		<a href="mailto:support@repeato.app" rel="noopener"
																			style="text-decoration: underline; color: #10a4da;"
																			target="_blank">support@repeato.app</a><br /><br />Thanks,<br />Your friends at
																		Repeato
																	</p>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="10" cellspacing="0" class="divider_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
														<tr>
															<td>
																<div align="center">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
																		<tr>
																			<td class="divider_inner"
																				style="font-size: 1px; line-height: 1px; border-top: 1px solid #BBBBBB;">

																			</td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="10" cellspacing="0" class="paragraph_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
														<tr>
															<td>
																<div
																	style="color:#000000;font-size:14px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:16.8px;">
																	<p style="margin: 0;">Repeato - Test Automation Simplified<br />Horeischygasse
																		13<br />1130 Vienna, Austria</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation"
						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack"
										role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0" class="icons_block" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
														<tr>
															<td
																style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
																<table cellpadding="0" cellspacing="0" role="presentation"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
																	<tr>
																		<td style="vertical-align: middle; text-align: center;">
																			<!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
																			<!--[if !vml]><!-->
																			<table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation"
																				style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">
																				<!--<![endif]-->
																				<tr>
																				</tr>
																			</table>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table><!-- End -->
</body>

</html>`;
  }

  Object.keys(replacements).forEach((key) => {
    const replacer = new RegExp(key, 'g');
    template = template.replace(replacer, replacements[key]);
  });

  return template;
}
